import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedules } from './entities/schedule.entity';
import { ScheduleService } from './services/schedule.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([DoctorSchedules])
    ],
    controllers: [],
    providers: [ScheduleService]
})
export class ScheduleModule { }
