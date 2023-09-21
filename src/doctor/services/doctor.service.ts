import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Doctor } from "../entities/doctor.entity";
import { Repository } from "typeorm";
import { SignUpDto } from "../dto/signUp.dto";
import { UpdateImageProfile } from "../dto/updateProfile";

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
            throw new ConflictException('Số điện thoại đã được đăng kí')

        const doctor = new Doctor()
        doctor.full_name = dto.full_name
        doctor.phone = dto.phone
        doctor.specialty = dto.specialty
        doctor.password = await this.hashing(dto.password)
        doctor.created_at = this.VNTime()
        doctor.updated_at = doctor.created_at

        await this.doctorRepository.save(doctor)

        return {
            data: {
                id: doctor.id,
                full_name: doctor.full_name,
                phone: doctor.phone,
                specialty: doctor.specialty
            },
            message: "Successfully"
        }
    }

    async updateImage(dto: UpdateImageProfile, id: string): Promise<any> {
        const doctor = await this.findDoctorById(id)

        doctor.avatar = dto.avatar

        await this.doctorRepository.save(doctor)

        return {
            data: doctor.avatar,
            message: "Successfully"
        }
    }

    async listDoctor(): Promise<any> {
        let listDoctor = await this.doctorRepository.find({
            select: ["id", "full_name", "specialty", "avatar"]
        })

        return {
            data: listDoctor
        }
    }

    async findDoctorByPhone(phone: string) {
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
}