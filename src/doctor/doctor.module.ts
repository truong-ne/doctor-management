import { Module } from '@nestjs/common';
import { DoctorService } from './services/doctor.service';
import { DoctorController } from './controllers/doctor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Doctor])
    ],
    controllers: [DoctorController],
    providers: [DoctorService],
    exports: [DoctorService]
})
export class DoctorModule { }