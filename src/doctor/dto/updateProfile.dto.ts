import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";

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