import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Repository } from "typeorm";
import { DoctorSchedules } from "../entities/schedule.entity";

@Injectable()
export class FeedbackService extends BaseService<DoctorSchedules> {
    constructor(
        @InjectRepository(DoctorSchedules) private readonly scheduleRepository: Repository<DoctorSchedules>
    ) {
        super(scheduleRepository)
    }

    async schedulePerDay(date: Date, start_time: Date, end_time: Date): Promise<any> {
        const schedule = new DoctorSchedules()
        schedule.date = date
        schedule.startTime = start_time
        schedule.endTime = end_time

        return await this.scheduleRepository.save(schedule)
    }
}