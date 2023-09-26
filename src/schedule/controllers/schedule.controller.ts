import { Body, Controller, Patch, Post, Get, UseGuards, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SchedulesService } from "../services/schedule.service";

@ApiTags('SCHEDULE')
@Controller('schedule')
export class SchedulesController {
    constructor(
        private readonly schedulesService: SchedulesService
    ) { }


}