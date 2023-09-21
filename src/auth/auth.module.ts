import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from './entities/token.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './services/auth.service';
import { DoctorModule } from 'src/doctor/doctor.module';

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '14d' }
        }),
        TypeOrmModule.forFeature([Token]),
        DoctorModule
    ],
    providers: [
        LocalStrategy,
        JwtStrategy,
        AuthService,
    ],
    controllers: [
        AuthController
    ]
})
export class AuthModule { }



