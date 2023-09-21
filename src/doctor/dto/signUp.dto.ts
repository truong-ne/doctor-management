import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsMobilePhone, IsEnum, IsStrongPassword } from "class-validator";
import { Specialty } from "../../config/enum.constants";

export class SignUpDto {
    @IsNotEmpty()
    @IsMobilePhone()
    @ApiProperty({ example: '0917068366' })
    phone: string

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({ example: 'StrongPassword1.' })
    password: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Dr.Nguyen Van A' })
    full_name!: string

    @IsNotEmpty()
    @IsEnum(Specialty)
    @ApiProperty({ example: 'gynaecologist' })
    specialty!: string
}