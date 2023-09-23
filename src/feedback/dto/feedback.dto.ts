import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Min, Max } from "class-validator";

export class FeedbackDto {
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    @ApiProperty({ example: 4 })
    rating: number

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'tg8SFM2zq7qOKp8aubbYt' })
    doctor_id: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'Tư vấn nhiệt tình' })
    feedback: string
}