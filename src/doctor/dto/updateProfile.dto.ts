import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Min } from "class-validator";
import { Specialty } from "../../config/enum.constants";

export class UpdateImageProfile {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({ example: 'cat-example' })
    avatar: string
}

export class UpdateBiograpyProfile {
    @IsString()
    @ApiProperty({ example: 'BSCKII Nguyễn Quốc Thái có hơn 15 năm kinh nghiệm học tập, nghiên cứu và làm việc trong lĩnh vực Ngoại tổng quát, chuyên ngành nội soi – phẫu thuật nội soi. Sau khi tốt nghiệp Bác sĩ Đa khoa Đại học Y Dược TP.HCM, Bác sĩ Nguyễn Quốc Thái tiếp tục tham gia các khóa đào tạo Bác sĩ Nội trú, chuyên khoa I Ngoại tổng quát và Chuyên khoa II Ngoại tổng quát của đại học này. Năm 2011, Bác sĩ Nguyễn Quốc Thái được cấp chứng chỉ Cắt tuyến giáp mổ mở và nội soi của BV Nội tiết Trung Ương. BSCKII Nguyễn Quốc Thái có 7 năm công tác tại BV Pháp Việt TP.HCM, 3 năm công tác tại BV Vinmec Central Park TP.HCM trước khi về làm việc tại BVĐK Tâm Anh TP.HCM với vai trò Bác sĩ Ngoại tổng quát.' })
    biography: string
}

export class UpdateFixedTime {
    @IsArray()
    @ApiProperty({ example: [[15, 16, 17, 18], [31, 32, 32, 34], [], [], [], [], [19, 20, 21, 22]] })
    fixed_times: any
}


export class UpdateEmail {
    @IsNotEmpty()
    @IsEmail()
    email: string
}

export class DoctorIdDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'id' })
    @IsString()
    doctor_id: string
}

export class ModifyDoctor {
    @IsString()
    @ApiProperty({ example: 'doctor_id' })
    doctor_id: string

    @IsPhoneNumber()
    @ApiProperty({ example: 'phone_number' })
    phone: string

    @IsString()
    @ApiProperty({ example: 'full_name' })
    full_name: string

    @IsEnum(Specialty)
    @ApiProperty({ example: 'specialty' })
    specialty: string

    @IsString()
    @ApiProperty({ example: 'example@exam.com' })
    email: string

    @IsNumber()
    @Min(1)
    @ApiProperty({ example: 3 })
    experience: number

    @IsNumber()
    @ApiProperty({ example: 200000 })
    fee_per_minutes: number
}