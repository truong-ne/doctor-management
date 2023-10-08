import { Body, Controller, Post, Get, UseGuards, Req, Inject } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { SchedulesService } from "../services/schedule.service";
import { DoctorGuard } from "src/auth/guards/doctor.guard";
import { UpdateSchedule } from "../dto/schedule.dto";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

@ApiTags('SCHEDULE')
@Controller('schedule')
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {

    }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Lấy tất cả thông tin lịch trình của bác sĩ" })
    @Get()
    async schedulesByDoctorId(
        @Req() req
    ): Promise<any> {
        const cacheSchedules = await this.cacheManager.get('schedules-' + req.user.id);
        if (cacheSchedules) return cacheSchedules

        const data = await this.schedulesService.scheduleByDoctorId(req.user.id)

        await this.cacheManager.set('schedules-' + req.user.id, data)

        return data
    }

    @UseGuards(DoctorGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: "Cập nhật thông tin thời gian làm việc của từng ngày cụ thể" })
    @Post()
    async updateSchedule(
        @Body() dto: UpdateSchedule
    ): Promise<any> {
        return await this.schedulesService.updateWorkingTime(dto.working_times, dto.schedule_id)
    }
}