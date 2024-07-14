import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Doctor } from "../entities/doctor.entity";
import { Between, DataSource, In, Repository } from "typeorm";
import { SignUpDto } from "../dto/signUp.dto";
import { ChangePasswordDto, ModifyDoctor, UpdateBiograpyProfile, UpdateEmail, UpdateFixedTime, UpdateImageProfile } from "../dto/updateProfile.dto";
import { nanoid } from "nanoid";
import * as nodemailer from 'nodemailer'
import { Cron, CronExpression } from '@nestjs/schedule'
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { promisify } from 'util'
import * as fs from 'fs'
import { ChangePasswordForgotDto } from "../dto/changePassword.dto";
import { Career } from "../entities/career.entity";
import { EducationAndCertification } from "../entities/educationAndCertification.entity";
import { Specialties } from "../entities/specialty.entity";
import { Specialty } from "src/config/enum.constants";

const readFile = promisify(fs.readFile);

const nodemailer = require("nodemailer")


@Injectable()
export class DoctorService extends BaseService<Doctor> {
    constructor(
        @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
        @InjectRepository(Career) private readonly careerRepository: Repository<Career>,
        @InjectRepository(Specialties) private readonly specialtyRepository: Repository<Specialties>,
        @InjectRepository(EducationAndCertification) private readonly educationAndCertificationRepository: Repository<EducationAndCertification>,
        private readonly amqpConnection: AmqpConnection,
        private dataSource: DataSource
    ) {
        super(doctorRepository)
    }
    @Cron(CronExpression.EVERY_10_MINUTES)
    async cronDoctor() {
        const information = await this.amqpConnection.request<string>({
            exchange: 'healthline.doctor.information',
            routingKey: 'information'
        })
        const doctors = await this.getAllDoctorPerPage(1, 100000, information)

        await fetch('https://meilisearch-truongne.koyeb.app/indexes/doctors/documents', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer CHOPPER_LOVE_MEILISEARCH',
                'Content-type': 'application/json'
            },
            body: JSON.stringify(doctors['data'])
        })
    }

    async signup(dto: SignUpDto): Promise<any> {
        const checkPhone = await this.findDoctorByPhone(dto.phone)

        if (checkPhone)
            throw new ConflictException('phone_number_has_already_been_registered')

        const checkEmail = await this.doctorRepository.findOne({
            where: { email: dto.email }
        })

        if (checkEmail)
            throw new ConflictException('email_number_has_already_been_registered')

        const queryRunner = await this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const password = nanoid(10)
    
            const doctor = new Doctor()
            doctor.full_name = dto.full_name
            doctor.phone = dto.phone
            doctor.gender = dto.gender
            doctor.dayOfBirth = dto.dayOfBirth
            doctor.email = dto.email
            doctor.password = await this.hashing(password)
            doctor.biography = dto.biography
            doctor.fixed_times = await this.fixedArrayToString(dto.fixed_times)
            doctor.created_at = this.VNTime()
            doctor.updated_at = doctor.created_at
    
            await this.doctorRepository.save(doctor)

            await this.doctorRepository.save(doctor)
    
            dto.careers.forEach(async c => {
                const career = new Career()
                career.doctor = doctor
                career.medicalInstitute = c.medicalInstitute
                career.periodEnd = c.periodEnd
                career.periodStart = c.periodStart
                career.position = c.position
    
                await this.careerRepository.save(career)
            })
    
            dto.specialty.forEach(async s => {
                const specialty = new Specialties()
                specialty.doctor = doctor
                specialty.image = s.image
                specialty.levelOfSpecialty = s.levelOfSpecialty
                specialty.specialty = s.specialty
    
                await this.specialtyRepository.save(specialty)
            })
    
            dto.educationAndCertification.forEach(async e => {
                const educationAndCertification = new EducationAndCertification()
                educationAndCertification.address = e.address
                educationAndCertification.dateOfReceiptOfDiploma = e.dateOfReceiptOfDiploma
                educationAndCertification.degreeOfEducation = e.degreeOfEducation
                educationAndCertification.diplomaNumberAndSeries = e.diplomaNumberAndSeries
                educationAndCertification.doctor = doctor
                educationAndCertification.institution = e.institution
                educationAndCertification.specialtyByDiploma = e.specialtyByDiploma
                educationAndCertification.typeOfEducationAndExperience = e.typeOfEducationAndExperience
    
                await this.educationAndCertificationRepository.save(educationAndCertification)
            })
    
            await this.mailer(doctor.email, password)
            await queryRunner.commitTransaction();
            return {
                code: 200,
                message: "success"
            } 
        } catch (error) {
            await queryRunner.rollbackTransaction(); 
            throw new BadRequestException('sign_up_failed')   
        } finally {
            await queryRunner.release();
        }
        
    }

    async updateImage(dto: UpdateImageProfile, id: string): Promise<any> {

        const doctor = await this.findDoctorById(id)

        doctor.avatar = dto.avatar

        await this.doctorRepository.save(doctor)

        return {
            data: {
                avatar: doctor.avatar
            },
            message: "successfully"
        }
    }

    async changePassword(doctor_id: string, dto: ChangePasswordDto): Promise<any> {
        const doctor = await this.doctorRepository.findOne({
            where: { id: doctor_id }
        })

        if (this.isMatch(doctor.password, dto.password))
            doctor.password = await this.hashing(dto.new_password)

        await this.doctorRepository.save(doctor)
        return {
            data: {
                password: doctor.password
            },
            message: "successfully"
        }
    }

    async updatedFixedTime(dto: UpdateFixedTime, id: string): Promise<any> {
        const doctor = await this.findDoctorById(id)

        doctor.fixed_times = await this.fixedArrayToString(dto.fixed_times)

        await this.doctorRepository.save(doctor)
        return {
            data: {
                fixed_times: doctor.fixed_times
            },
            message: "successfully"
        }
    }

    async updateBiography(dto: UpdateBiograpyProfile, id: string): Promise<any> {
        const doctor = await this.doctorRepository.findOne({
            where: { id: id }
        })

        doctor.biography = dto.biography

        await this.doctorRepository.save(doctor)

        return {
            data: {
                biography: doctor.biography
            },
            message: "successfully"
        }
    }

    async updateEmail(dto: UpdateEmail, id: string): Promise<any> {
        const doctor = await this.doctorRepository.findOne({
            where: { id: id }
        })

        doctor.email = dto.email

        await this.doctorRepository.save(doctor)

        return {
            data: {
                email: doctor.email
            },
            message: 'successfully'
        }
    }

    async findDoctorByPhone(phone: string): Promise<Doctor> {
        return await this.doctorRepository.findOneBy({ phone: phone })
    }

    async findDoctorById(user_id: string) {
        try {
            return await this.doctorRepository.findOne({
                where: { id: user_id }
            })
        } catch (error) {
            throw new NotFoundException()
        }
    }

    async findAllDoctor(): Promise<Doctor[]> {
        return await this.doctorRepository.find({
            select: ['id', 'fixed_times']
        })
    }

    async profileDoctor(doctor_id): Promise<any> {
        const doctor = await this.doctorRepository.findOne({
            where: { id: doctor_id },
        })

        const { password, ...data } = { ...doctor }

        return {
            data: data
        }
    }

    async doctorCount(): Promise<any> {
        const count = await this.doctorRepository.count()

        return {
            data: {
                quantity: count
            }
        }
    }

    async getAllDoctorPerPage(page: number, num: number, information: any): Promise<any> {
        var skip = (page - 1) * num
        const doctors = await this.doctorRepository.find({ skip: skip, take: num, order: { updated_at: "DESC" }, relations: ['specialties', 'careers', 'educationAndCertification'] })
        const data = []

        doctors.forEach(e => {
            var flag = false
            for (const i of information) {
                if (e.id === i.doctor_id) {
                    flag = true
                    data.push({
                        id: e.id,
                        full_name: e.full_name,
                        avatar: e.avatar,
                        email: e.email,
                        phone: e.phone,
                        dayOfBirth: e.dayOfBirth,
                        gender: e.gender,
                        careers: e.careers,
                        specialty: e.specialties,
                        educationAndCertification: e.educationAndCertification,
                        biography: e.biography,
                        fee_per_minutes: e.fee_per_minutes,
                        account_balance: e.account_balance,
                        is_active: e.isActive,
                        ratings: i.averageRating,
                        number_of_consultation: i.quantity,
                        updated_at: e.updated_at
                    })
                    break
                }
            }
            if (!flag) {
                data.push({
                    id: e.id,
                    full_name: e.full_name,
                    avatar: e.avatar,
                    email: e.email,
                    phone: e.phone,
                    dayOfBirth: e.dayOfBirth,
                    gender: e.gender,
                    careers: e.careers,
                    specialty: e.specialties,
                    educationAndCertification: e.educationAndCertification,
                    biography: e.biography,
                    fee_per_minutes: e.fee_per_minutes,
                    account_balance: e.account_balance,
                    is_active: e.isActive,
                    ratings: 0,
                    number_of_consultation: 0,
                    updated_at: e.updated_at
                })
            }
        })
        return {
            data: data
        }
    }

    async findAllDoctorFullInfo(uids: string[]) {
        const doctors = await this.doctorRepository.find({ where: { id: In(uids) }, relations: ['specialties', 'careers', 'educationAndCertification'] })
        const data = []

        const information = await this.amqpConnection.request<any>({
            exchange: 'healthline.doctor.information',
            routingKey: 'information'
        })

        doctors.forEach(e => {
            var flag = false
            for (const i of information) {
                if (e.id === i.doctor_id) {
                    flag = true
                    data.push({
                        id: e.id,
                        full_name: e.full_name,
                        avatar: e.avatar,
                        email: e.email,
                        phone: e.phone,
                        dayOfBirth: e.dayOfBirth,
                        gender: e.gender,
                        careers: e.careers,
                        specialty: e.specialties,
                        educationAndCertification: e.educationAndCertification,
                        biography: e.biography,
                        fee_per_minutes: e.fee_per_minutes,
                        account_balance: e.account_balance,
                        is_active: e.isActive,
                        ratings: i.averageRating,
                        number_of_consultation: i.quantity,
                        updated_at: e.updated_at
                    })
                    break
                }
            }
            if (!flag) {
                data.push({
                    id: e.id,
                    full_name: e.full_name,
                    avatar: e.avatar,
                    email: e.email,
                    phone: e.phone,
                    dayOfBirth: e.dayOfBirth,
                    gender: e.gender,
                    careers: e.careers,
                    specialty: e.specialties,
                    educationAndCertification: e.educationAndCertification,
                    biography: e.biography,
                    fee_per_minutes: e.fee_per_minutes,
                    account_balance: e.account_balance,
                    is_active: e.isActive,
                    ratings: 0,
                    number_of_consultation: 0,
                    updated_at: e.updated_at
                })
            }
        })
        return {
            "code": 200,
            "message": "success",
            "data": data
        }
    }

    async findAllDoctorInfo(uids: string[]) {
        const doctor = await this.doctorRepository.find({ where: { id: In(uids) } })

        const data = []
        doctor.forEach(e => {
            data.push({
                id: e.id,
                full_name: e.full_name,
                avatar: e.avatar
            })
        })
        return {
            "code": 200,
            "message": "success",
            "data": data
        }
    }

    async deleteDoctor(doctor_id: string) {
        const doctor = await this.doctorRepository.findOne({
            where: { id: doctor_id }
        })

        if (!doctor)
            throw new NotFoundException('doctor_not_found')

        await this.doctorRepository.delete(doctor)

        return {
            message: 'delete_successfully'
        }
    }

    async mailer(email: string, password: string) {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: "healthlinemanager2023@gmail.com",
                pass: "eizm tolt wjyi qdjn",
            },
        });

        const htmlContent = await readFile('./src/template/newpassword.html', 'utf8');
        const modifiedHtmlContent = htmlContent.replace('{{ password }}', password);

        const info = await transporter.sendMail({
            from: '"Healthline Inc" <healthlinemanager2023@gmail.com>',
            to: `${email}`,
            subject: "[PASSWORD] DOCTOR", // Subject line
            text: `Your new Password is ${password}`, // plain text body
            html: modifiedHtmlContent
        });

        console.log("Password sent: %s", info.messageId);
    }

    async modifyDoctor(dto: ModifyDoctor) {
        const doctor = await this.doctorRepository.findOne({
            where: { id: dto.doctor_id }
        })

        if (!doctor)
            throw new NotFoundException('doctor_not_found')

        const vPhone = await this.doctorRepository.findOne({
            where: { phone: dto.phone }
        })

        if (vPhone && doctor.phone !== dto.phone)
            throw new ConflictException('phone_used')

        const vEmail = await this.doctorRepository.findOne({
            where: { email: dto.email }
        })

        if (vEmail && doctor.email !== dto.email)
            throw new ConflictException('email_used')

        doctor.phone = dto.phone
        doctor.full_name = dto.full_name
        doctor.email = dto.email
        doctor.isActive = dto.is_Active
        doctor.fee_per_minutes = dto.fee_per_minutes

        const data = await this.doctorRepository.save(doctor)

        return { data: data }
    }

    async disactiveDoctor(id: string) {
        const doctor = await this.doctorRepository.findOne({
            where: { id: id }
        })

        if (!doctor)
            throw new NotFoundException('doctor_not_found')

        doctor.isActive = false
        await this.doctorRepository.save(doctor)

        this.cronDoctor()

        return {
            "code": 200,
            "message": "success"
        }
    } 

    async joinDoctor() {
        const startOfMonth = this.VNTime(-this.VNTime().getUTCDate() + 1)
        const endOfMonth = this.VNTime(-this.VNTime().getUTCDate() + 1).getMonth() === 11 ? this.VNTime(32 - this.VNTime().getUTCDate()) : this.VNTime(0);

        const quantity = await this.doctorRepository.count({
            where: {
                created_at: Between(startOfMonth, endOfMonth)
            }
        })

        return {
            data: quantity
        }
    }

    async adminResetPassword(id: string) {
        const doctor = await this.doctorRepository.findOne({
            where: { id: id }
        })

        const password = nanoid(10)
        await this.mailer(doctor.email, password)

        return {
            message: "reset successfully"
        }
    }

    async forgetPassword(email: string): Promise<any> {
        const checkEmail = await this.doctorRepository.findOne({
            where: { email: email }
        })

        if (!checkEmail)
            throw new NotFoundException('email_not_found')

        const rabbitmq = await this.amqpConnection.request<any>({
            exchange: 'healthline.doctor.information',
            routingKey: 'create_otp',
            payload: checkEmail.id,
            timeout: 10000,
        })

        if (!rabbitmq || rabbitmq === '')
            throw new BadRequestException('send_email_failed')

        await this.mailer(checkEmail.email, rabbitmq)

        return {
            "code": 200,
            "message": "success"
        }
    }

    async changePasswordForgot(dto: ChangePasswordForgotDto): Promise<any> {
        const doctor = await this.doctorRepository.findOne({
            where: { email: dto.email }
        })
        if (!doctor)
            throw new NotFoundException('email_not_found')

        if (dto.password !== dto.passwordConfirm)
            throw new BadRequestException('password_incorrect')
        else if (doctor.password === dto.password)
            throw new BadRequestException('password_had_use')
        else {
            const rabbitmq = await this.amqpConnection.request<any>({
                exchange: 'healthline.doctor.information',
                routingKey: 'check_otp',
                payload: { userId: doctor.id, code: dto.otp },
                timeout: 10000,
            })

            if (rabbitmq) {
                doctor.password = await this.hashing(dto.password)
            } else
                throw new BadRequestException('otp_expired')
        }

        try {
            await this.doctorRepository.save(doctor)
        } catch (error) {
            throw new BadRequestException('update_doctor_failed')
        }

        return {
            "code": 200,
            "message": "success"
        }
    }

    async statisticDoctorBySpecialty() {
        const data = {}
        for(let specialty in Specialty) {
            const specialtys = await this.specialtyRepository.findBy({ specialty: specialty })
            data[specialty] = specialtys.length
        }

        return {
            code: 200,
            message: 'success',
            data: data
        }
    }

    //transaction
    async DoctorPaymentCashOut(doctorId: string, amount: number) {
        const doctor = await this.findDoctorById(doctorId)

        if(doctor.account_balance < amount)
            throw new BadRequestException('not_enough_money')
        
        const rabbitmq = await this.amqpConnection.request<any>({
            exchange: 'healthline.user.information',
            routingKey: 'doctor_cash_out',
            payload: { doctor: doctorId, amount: amount },
            timeout: 10000,
        })

        await this.doctorRepository.update({ id: doctorId }, {
            account_balance: doctor.account_balance - amount
        })

        return {
            code: 200,
            message: 'success'
        }
    }

    async DoctorTransactionHistory(doctorId: string) {
        const rabbitmq = await this.amqpConnection.request<any>({
            exchange: 'healthline.user.information',
            routingKey: 'doctor_transaction',
            payload: { doctor: doctorId },
            timeout: 10000,
        })

        return {
            code: 200,
            message: 'success',
            data: rabbitmq
        }
    }
}