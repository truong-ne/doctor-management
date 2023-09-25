import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Repository } from "typeorm";
import { DoctorRates } from "../entities/feedback.entity";
import { Doctor } from "../../doctor/entities/doctor.entity";
import { Specialty } from "../../config/enum.constants";

@Injectable()
export class FeedbackService extends BaseService<DoctorRates> {
    constructor(
        @InjectRepository(Doctor) private readonly doctorRepository: Repository<Doctor>,
        @InjectRepository(DoctorRates) private readonly feedbackRepository: Repository<DoctorRates>
    ) {
        super(feedbackRepository)
    }
    async findDoctorById(id: string): Promise<Doctor> {
        return await this.doctorRepository.findOne({
            where: { id: id },
            select: ['id', 'avatar', 'full_name', 'specialty']
        })
    }

    async doctorRated(user_id: string, rated: number, doctor_id: string, feedback: string): Promise<DoctorRates> {
        const doctor_rated = new DoctorRates()

        doctor_rated.user_id = user_id
        doctor_rated.rated = rated
        doctor_rated.doctor = await this.findDoctorById(doctor_id)
        doctor_rated.feedback = feedback
        doctor_rated.created_at = this.VNTime()

        return await this.feedbackRepository.save(doctor_rated)
    }

    async getAllReviewById(doctor_id: string): Promise<DoctorRates[]> {
        const doctor = await this.findDoctorById(doctor_id)

        if (!doctor)
            throw new NotFoundException('no_feedback_yet')

        return await this.feedbackRepository.find({
            where: { doctor: doctor },
            select: ['rated', 'feedback']
        })
    }

    async getAverageRatingByDoctorId(doctor_id: string): Promise<any> {
        const averageRating = await this.feedbackRepository
            .createQueryBuilder('doctorRate')
            .select('AVG(doctorRate.rated)', 'averageRating')
            .where('doctorRate.doctor.id = :doctor_id', { doctor_id })
            .getRawOne();

        const doctor = await this.findDoctorById(doctor_id);

        return {
            data: {
                avatar: doctor.avatar,
                name: doctor.full_name,
                specialty: doctor.specialty,
                biography: doctor.biography,
                averageRating: parseFloat(averageRating.averageRating) || 0,
                reviewed: await this.feedbackRepository.count({
                    where: { doctor: doctor }
                })
            },
        };
    }

    async getAverageRatingForAllDoctors(): Promise<{
        avatar: string,
        name: string,
        specialty: Specialty,
        averageRating: number,
        reviewed: number
    }[]> {
        const doctors = await this.feedbackRepository
            .createQueryBuilder('doctorRate')
            .select('DISTINCT(doctorRate.doctor.id)', 'doctorId')
            .getRawMany();

        const averageRatings = await Promise.all(
            doctors.map(async (doctor) => {
                const averageRating = await this.getAverageRatingByDoctorId(doctor.doctorId);
                return {
                    avatar: averageRating.data.avatar,
                    name: averageRating.data.name,
                    specialty: averageRating.data.specialty,
                    biography: averageRating.data.biography,
                    averageRating: averageRating.data.averageRating,
                    reviewed: averageRating.data.reviewed
                }
            })
        );

        return averageRatings;
    }
}