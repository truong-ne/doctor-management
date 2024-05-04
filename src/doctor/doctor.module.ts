import { Module } from '@nestjs/common';
import { DoctorService } from './services/doctor.service';
import { DoctorController } from './controllers/doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import * as dotenv from 'dotenv'
import { ScheduleModule } from '@nestjs/schedule';
import { DoctorConsumer } from './consumers/doctor.consumer';
import { Career } from './entities/career.entity';
import { EducationAndCertification } from './entities/educationAndCertification.entity';
import { Specialties } from './entities/specialty.entity';

dotenv.config()

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor, Career,  EducationAndCertification, Specialties]),
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