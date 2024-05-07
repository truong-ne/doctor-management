import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsMobilePhone, IsEnum, IsStrongPassword, Min, IsArray, IsBoolean, IsEmail } from "class-validator";
import { Specialty } from "../../config/enum.constants";
import { CareerDto } from "./career.dto";
import { SpecialtyDto } from "./specialty.dto";
import { EducationAndCertificationDto } from "./educationAndCertification.dto";

export class SignUpDto {
    @IsNotEmpty()
    @IsMobilePhone()
    @ApiProperty({ example: '+84917068366' })
    phone: string

    @IsNotEmpty()
    @IsBoolean()
    @ApiProperty({ example: 'true' })
    gender: boolean

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '07/07/2002' })
    dayOfBirth: string

    @IsArray()
    @ApiProperty({ example: '[[],[],[],[],[],[],[]]' })
    fixed_times: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Dr.Nguyen Van A' })
    full_name!: string

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({ example: 'dr@gmail.com' })
    email!: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Dr.Nguyen Van A' })
    biography!: string

    @IsArray()
    careers: CareerDto[]

    @IsArray()
    specialty: SpecialtyDto[]

    @IsArray()
    educationAndCertification: EducationAndCertificationDto[]
}