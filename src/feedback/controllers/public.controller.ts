import { Controller, Get, } from "@nestjs/common";
import { FeedbackService } from "../services/feedback.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('EVULATED')
@Controller()
export class PublicController {
    constructor(
        private readonly feedbackService: FeedbackService
    ) { }
    @ApiOperation({ summary: 'Xem thông tin cơ bản của tất cả bác sĩ' })
    @Get('public')
    async averageRateForAllDoctor() {
        return await this.feedbackService.getAverageRatingForAllDoctors()
    }
}