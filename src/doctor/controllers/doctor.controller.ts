import { Body, Controller, Param, Patch, Post, Get } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { DoctorService } from "../services/doctor.service";
import { UpdateImageProfile } from "../dto/updateProfile";
import { SignUpDto } from "../dto/signUp.dto";

@Controller('doctor')
export class DoctorController {
    constructor(
        private readonly doctorService: DoctorService
    ) { }

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