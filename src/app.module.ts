import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { postgresOption } from './config/database.config';
import { AuthModule } from './auth/auth.module';
import { FeedbackModule } from './review/feedback.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...postgresOption,
      autoLoadEntities: true
    }),
    AuthModule,
    DoctorModule,
    FeedbackModule
  ],
})
export class AppModule { }
