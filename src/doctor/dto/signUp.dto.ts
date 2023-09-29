import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsMobilePhone, IsEnum, IsStrongPassword, Min, IsArray } from "class-validator";
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

    @IsNotEmpty()
    @Min(0)
    @ApiProperty({ example: 5 })
    experience: number

    @IsNotEmpty()
    @Min(0)
    @ApiProperty({ example: 20 })
    fee_per_minutes: number

    @IsNotEmpty()
    @IsArray()
    @ApiProperty({ example: [[15, 16, 17, 18], [31, 32, 32, 34], [], [], [], [], [19, 20, 21, 22]] })
    fixed_times: any
}