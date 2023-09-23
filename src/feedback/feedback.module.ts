import { Module } from '@nestjs/common';
import { DoctorRates } from './entities/feedback.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedbackController } from './controllers/feedback.controller';
import { FeedbackService } from './services/feedback.service';
import { Doctor } from 'src/doctor/entities/doctor.entity';
import { PublicController } from './controllers/public.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([DoctorRates, Doctor])
    ],
    controllers: [
        FeedbackController,
        PublicController
    ],
    providers: [FeedbackService],
    exports: []
})
export class FeedbackModule { }
