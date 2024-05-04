import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CareerDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Benh vien TPHCM' })
    medicalInstitute: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'link' })
    position: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '02/04/2018' })
    periodStart: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '02/04/2020' })
    periodEnd: string
}