import { ApiProperty } from "@nestjs/swagger"
import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { Specialty } from "../../config/enum.constants"

export class EducationAndCertificationDto {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'univercity' })
    typeOfEducationAndExperience: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Good' })
    degreeOfEducation: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'School' })
    institution: string

    @IsNotEmpty()
    @IsEnum(Specialty)
    @ApiProperty({ example: 'gynaecologist' })
    specialtyByDiploma: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'hcm' })
    address: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'S123' })
    diplomaNumberAndSeries: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: '01/01/2021' })
    dateOfReceiptOfDiploma: string
}