import { Body, Controller, Patch, Post, Get, UseGuards, Req } from "@nestjs/common";
import { DoctorService } from "../services/doctor.service";
import { UpdateBiograpyProfile, UpdateImageProfile } from "../dto/updateProfile";
import { SignUpDto } from "../dto/signUp.dto";
import { DoctorGuard } from "../../auth/guards/doctor.guard";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Specialty } from "../../config/enum.constants";

@ApiTags('PROFILE')
@Controller('doctor')
export class DoctorController {
    constructor(
        private readonly doctorService: DoctorService
    ) { }

    @ApiOperation({ summary: 'Đăng kí tài khoản bác sĩ (tạm thời chưa có sms 2fa)' })
    @ApiResponse({ status: 201, description: 'Tạo tài khoản thành công' })
    @ApiResponse({ status: 400, description: 'Đầu vào không hợp lệ' })
    @ApiResponse({ status: 409, description: 'Số điện thoại đã được đăng kí' })
    @ApiParam({ name: 'specialty', enum: Specialty })
    @Post()
    async signUpDoctor(
        @Body() dto: SignUpDto
    ): Promise<any> {
        return await this.doctorService.signup(dto)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Thay đổi avatar của bác sĩ' })
    @UseGuards(DoctorGuard)
    @ApiResponse({ status: 200, description: 'Thành công' })
    @ApiResponse({ status: 400, description: 'Sai đầu vào' })
    @Patch('avatar')
    async updateImageProfile(
        @Body() dto: UpdateImageProfile,
        @Req() req
    ): Promise<any> {
        return await this.doctorService.updateImage(dto, req.user.id)
    }

    @ApiBearerAuth()
    @ApiOperation({ summary: 'Thay đổi biography của bác sĩ' })
    @UseGuards(DoctorGuard)
    @ApiResponse({ status: 200, description: 'Thành công' })
    @ApiResponse({ status: 400, description: 'Sai đầu vào' })
    @Patch('biography')
    async updateBiographyProfile(
        @Body() dto: UpdateBiograpyProfile,
        @Req() req
    ): Promise<any> {
        return await this.doctorService.updateBiography(dto, req.user.id)
    }
}