import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedules } from './entities/schedule.entity';
import { SchedulesService } from './services/schedule.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulesController } from './controllers/schedule.controller';
import { DoctorModule } from '../doctor/doctor.module';
import { ScheduleGateway } from './events/schedule.event';

@Module({
    imports: [
        TypeOrmModule.forFeature([DoctorSchedules]),
        ScheduleModule.forRoot(),
        DoctorModule
    ],
    controllers: [SchedulesController],
    providers: [
        SchedulesService,
        ScheduleGateway
    ]
})
export class SchedulesModule { }
