import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Specialty } from "../../config/enum.constants"

export class SpecialtyDto {
    @IsNotEmpty()
    @IsEnum(Specialty)
    @ApiProperty({ example: 'gynaecologist' })
    specialty!: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Middle' })
    levelOfSpecialty: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'link' })
    image: string
}