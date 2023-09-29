import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsArray } from "class-validator";

export class UpdateSchedule {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'DLwy3JdPir-7wtZ0cuIgz' })
    schedule_id: string

    @ApiProperty({ example: [14, 15, 16, 17] })
    workingTime: number[]
}