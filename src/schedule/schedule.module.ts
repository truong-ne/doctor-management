import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedules } from './entities/schedule.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DoctorSchedules])
    ],
    controllers: [],
    providers: []
})
export class ScheduleModule { }
