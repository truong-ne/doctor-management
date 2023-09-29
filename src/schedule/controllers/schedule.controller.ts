import { Body, Controller, Patch, Post, Get, UseGuards, Req, UseInterceptors } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SchedulesService } from "../services/schedule.service";
import { DoctorGuard } from "src/auth/guards/doctor.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";

@ApiTags('SCHEDULE')
@Controller('schedule')
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService
    ) { }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @UseInterceptors(CacheInterceptor)
    @Get()
    async schedulesByDoctorId(
        @Req() req
    ): Promise<any> {
        return await this.schedulesService.scheduleByDoctorId(req.user.id)
    }

    @Post()
    async testProxy() {
        return "HAHAHA"
    }
}