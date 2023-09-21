import { Body, Controller, Param, Patch, Post, Get, UseGuards } from "@nestjs/common";
import { DoctorService } from "../services/doctor.service";
import { UpdateImageProfile } from "../dto/updateProfile";
import { SignUpDto } from "../dto/signUp.dto";
import { DoctorGuard } from "../../auth/guards/doctor.guard";

@Controller('doctor')
export class DoctorController {
    constructor(
        private readonly doctorService: DoctorService
    ) { }

    @UseGuards(DoctorGuard)
    @Patch(':doctorId')
    async updateImageProfile(
        @Body() dto: UpdateImageProfile,
        @Param('doctorId') doctorId: string
    ): Promise<string> {
        return await this.doctorService.updateImage(dto, doctorId)
    }

    @Post()
    async signUpDoctor(
        @Body() dto: SignUpDto
    ): Promise<any> {
        return await this.doctorService.signup(dto)
    }

    @Get()
    async listDoctor() {
        return await this.doctorService.listDoctor()
    }
}