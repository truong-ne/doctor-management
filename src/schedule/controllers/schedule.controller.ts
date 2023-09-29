import { Body, Controller, Patch, Post, Get, UseGuards, Req, UseInterceptors, Param } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SchedulesService } from "../services/schedule.service";
import { DoctorGuard } from "src/auth/guards/doctor.guard";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { UpdateSchedule } from "../dto/schedule.dto";

@ApiTags('SCHEDULE')
@Controller('schedule')
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService
    ) { }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @UseInterceptors(CacheInterceptor)
    @ApiOperation({ summary: "Lấy tất cả thông tin lịch trình của bác sĩ" })
    @Get()
    async schedulesByDoctorId(
        @Req() req
    ): Promise<any> {
        return await this.schedulesService.scheduleByDoctorId(req.user.id)
    }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Cập nhật thông tin thời gian làm việc của từng ngày cụ thể" })
    @Post()
    async updateSchedule(
        @Body() dto: UpdateSchedule
    ): Promise<any> {
        return await this.schedulesService.updateWorkingTime(dto.workingTime, dto.schedule_id)
    }
}