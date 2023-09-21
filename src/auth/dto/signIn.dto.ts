import { ApiProperty } from "@nestjs/swagger";
import { IsMobilePhone, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    @IsMobilePhone()
    @ApiProperty({ example: '0917068366' })
    phone: string

    @IsNotEmpty()
    @IsStrongPassword()
    @ApiProperty({ example: 'customer' })
    password: string
}