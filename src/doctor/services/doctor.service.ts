import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Doctor } from "../entities/doctor.entity";
import { Repository } from "typeorm";
import { SignUpDto } from "../dto/signUp.dto";
import { UpdateBiograpyProfile, UpdateEmail, UpdateFixedTime, UpdateImageProfile } from "../dto/updateProfile.dto";

@Injectable()
export class DoctorService extends BaseService<Doctor> {
    constructor(
        @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>
    ) {
        super(doctorRepository)
    }

    async signup(dto: SignUpDto): Promise<any> {
        const check = await this.findDoctorByPhone(dto.phone)

        if (check)
            throw new ConflictException('phone_number_has_already_been_registered')

        const doctor = new Doctor()
        doctor.full_name = dto.full_name
        doctor.phone = dto.phone
        doctor.specialty = dto.specialty
        doctor.password = await this.hashing(dto.password)
        doctor.experience = dto.experience
        doctor.fee_per_minutes = dto.fee_per_minutes
        doctor.fixed_times = await this.fixedArrayToString(dto.fixed_times)
        doctor.created_at = this.VNTime()
        doctor.updated_at = doctor.created_at

        await this.doctorRepository.save(doctor)

        return {
            data: {
                id: doctor.id,
                full_name: doctor.full_name,
                phone: doctor.phone,
                specialty: doctor.specialty,
                experience: doctor.experience,
                fee_per_minutes: doctor.fee_per_minutes,
                fixed_times: doctor.fixed_times
            },
            message: "succesfully"
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
        const doctors = await this.doctorRepository.find({ skip: skip, take: num, order: { updated_at: "DESC" } })
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
                        specialty: e.specialty,
                        ratings: i.averageRating,
                        number_of_consultation: i.quantity,
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
                    specialty: e.specialty,
                    ratings: 0,
                    number_of_consultation: 0,
                })
            }
        })
        return {
            data: data
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
}