import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BaseService } from "../../config/base.service";
import { Between, LessThan, LessThanOrEqual, Repository } from "typeorm";
import { DoctorSchedules } from "../entities/schedule.entity";
import { DoctorService } from "../../doctor/services/doctor.service";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class SchedulesService extends BaseService<DoctorSchedules> {
    constructor(
        @InjectRepository(DoctorSchedules) private readonly schedulesRepository: Repository<DoctorSchedules>,
        @Inject(DoctorService) private readonly doctorService: DoctorService
    ) {
        super(schedulesRepository)
    }

    @Cron(CronExpression.EVERY_DAY_AT_9PM)
    async handleSchedules() {
        console.log('Running ensureSchedulesForDoctors day at 9PM')
        await this.ensureSchedulesForDoctors()
    }

    @Cron(CronExpression.EVERY_DAY_AT_9AM)
    async deleteSchedules() {
        console.log('Running deleteSchedules every day at 9AM')
        await this.schedulesToDelete()
    }

    async ensureSchedulesForDoctors() {
        const today = this.VNTime();
        const endDate = new Date(today);
        endDate.setDate(today.getDate() + 14);

        const doctors = await this.doctorService.findAllDoctor();

        for (let doctor of doctors) {
            const existingSchedules = await this.schedulesRepository.count({
                where: {
                    id: doctor.id,
                    day: Between(today.getUTCDate(), endDate.getUTCDate()),
                    month: today.getUTCMonth() + 1,
                    year: today.getUTCFullYear(),
                },
            });

            const numberOfDays = 14

            if (existingSchedules < numberOfDays) {
                const schedulesToCreate = [];

                for (let i = 0; i < numberOfDays; i++) {
                    const currentDate = new Date(today);
                    currentDate.setDate(today.getDate() + i);

                    const scheduleExists = await this.schedulesRepository.findOne({
                        where: {
                            doctor: doctor,
                            day: currentDate.getUTCDate(),
                            month: currentDate.getUTCMonth() + 1,
                            year: currentDate.getUTCFullYear(),
                        }
                    });

                    if (!scheduleExists) {
                        const schedule = new DoctorSchedules();
                        schedule.doctor = doctor;
                        schedule.day = currentDate.getUTCDate();
                        schedule.month = currentDate.getUTCMonth() + 1;
                        schedule.year = currentDate.getUTCFullYear();

                        schedulesToCreate.push(schedule);
                    }
                }

                await this.schedulesRepository.save(schedulesToCreate);

                console.log(`Created schedules for Doctor ${doctor.id}`);
            }
        }
    }

    async schedulesToDelete() {
        const today = this.VNTime()

        const schedulesToDelete = await this.schedulesRepository.find({
            where: [
                {
                    year: LessThan(today.getUTCFullYear())
                },
                {
                    year: LessThanOrEqual(today.getUTCFullYear()),
                    month: LessThan(today.getUTCMonth() + 1)
                },
                {
                    year: LessThanOrEqual(today.getUTCFullYear()),
                    month: LessThanOrEqual(today.getUTCMonth() + 1),
                    day: LessThan(today.getUTCDate())
                }
            ]
        })

        console.log(schedulesToDelete)

        if (schedulesToDelete && schedulesToDelete.length > 0) {
            await this.schedulesRepository.remove(schedulesToDelete)
        }
    }

    async scheduleByDoctorId(id: string): Promise<any> {
        const doctor = await this.doctorService.findDoctorById(id)
        if (!doctor) {
            throw new NotFoundException('schedules_not_found')
        }

        return {
            data: await this.schedulesRepository.find({
                where: { doctor: doctor }
            })
        }
    }
}
