import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSchedules } from './entities/schedule.entity';
import { SchedulesService } from './services/schedule.service';
import { SchedulesController } from './controllers/schedule.controller';
import { DoctorModule } from '../doctor/doctor.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as dotenv from 'dotenv'
import { ScheduleConsumer } from './consumers/schedule.consumer';

dotenv.config()
@Module({
    imports: [
        TypeOrmModule.forFeature([DoctorSchedules]),
        DoctorModule,
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'healthline.consultation.schedule',
                    type: 'direct'
                }
            ],
            uri: process.env.RABBITMQ_URL,
            connectionInitOptions: { wait: true, reject: true, timeout: 10000 },
        }),
    ],
    controllers: [SchedulesController],
    providers: [
        SchedulesService,
        ScheduleConsumer
    ]
})
export class SchedulesModule { }
