import { Module } from '@nestjs/common';
import { DoctorService } from './services/doctor.service';
import { DoctorController } from './controllers/doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as dotenv from 'dotenv'
import { ScheduleModule } from '@nestjs/schedule';
import { DoctorConsumer } from './consumers/doctor.consumer';

dotenv.config()

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor]),
        RabbitMQModule.forRoot(RabbitMQModule, {
            exchanges: [
                {
                    name: 'healthline.doctor.information',
                    type: 'direct'
                }
            ],
            uri: process.env.RABBITMQ_URL,
            connectionInitOptions: { wait: true, reject: true, timeout: 10000 },
        }),
        ScheduleModule.forRoot()
    ],
    controllers: [DoctorController],
    providers: [DoctorService, DoctorConsumer],
    exports: [DoctorService]
})
export class DoctorModule { }