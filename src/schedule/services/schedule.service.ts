import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Repository } from "typeorm";
import { DoctorSchedules } from "../entities/schedule.entity";

@Injectable()
export class ScheduleService extends BaseService<DoctorSchedules> {
    constructor(
        @InjectRepository(DoctorSchedules) private readonly scheduleRepository: Repository<DoctorSchedules>
    ) {
        super(scheduleRepository)
    }

    async createSchedule() {
        const schedule = new DoctorSchedules()
        schedule.day = 1
        schedule.month = 1
        schedule.year = 2023
        schedule.workingTimes = '9-10|22-23'

        await this.scheduleRepository.save(schedule)

        return "TRUE"
    }

    async getAllDayInMonth(): Promise<{ day: number; month: number; year: number, startTime: number, endTime: number }[]> {
        const today = this.VNTime();
        const year = today.getUTCFullYear();
        const month = today.getUTCMonth();
        const daysInMonth: { day: number; month: number; year: number; startTime: number, endTime: number }[] = [];

        const startDate = new Date(Date.UTC(year, month, today.getDate()));

        const endDate = new Date(Date.UTC(year, month, today.getDate() + 14));

        for (let date = new Date(startDate); date <= endDate; date.setUTCDate(date.getUTCDate() + 1)) {
            daysInMonth.push({
                day: date.getUTCDate(),
                month: date.getUTCMonth() + 1,
                year: date.getUTCFullYear(),
                startTime: today.getHours(),
                endTime: today.getUTCHours() + 15
            });
        }

        return daysInMonth;
    }
}