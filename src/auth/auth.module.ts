import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { DoctorStrategy } from './strategies/doctor.strategy';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '14d' }
        }),
    ],
    providers: [
        DoctorStrategy,
    ],
})
export class AuthModule { }



