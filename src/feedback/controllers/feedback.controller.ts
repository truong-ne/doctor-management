import { Controller, Patch, Post, Get, UseGuards, Req, Body } from "@nestjs/common";
import { DoctorGuard } from "../../auth/guards/doctor.guard";
import { UserGuard } from "../../auth/guards/user.guard"
import { FeedbackService } from "../services/feedback.service";
import { FeedbackDto } from "../dto/feedback.dto";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('EVULATED')
@Controller('feedback')
export class FeedbackController {
    constructor(
        private readonly feedbackService: FeedbackService
    ) { }

    @ApiOperation({ summary: 'Đánh giá của người dùng dành cho bác sĩ sau cuộc hẹn video call' })
    @ApiResponse({ status: 201, description: "Thành công" })
    @ApiBearerAuth()
    @UseGuards(UserGuard)
    @Post()
    async DoctorRate(
        @Req() req,
        @Body() dto: FeedbackDto
    ): Promise<any> {
        const data = await this.feedbackService.doctorRated(req.user.id, dto.rating, dto.doctor_id, dto.feedback)

        return {
            data: {
                rated: data.rated,
                doctor: {
                    full_name: data.doctor.full_name,
                    specialty: data.doctor.specialty
                },
                feedback: data.feedback
            }
        }
    }

    @ApiOperation({ summary: 'Bác sĩ xem tất cả đánh giá và góp ý của khách hàng' })
    @ApiBearerAuth()
    @ApiResponse({ status: 200, description: 'Thành công' })
    @UseGuards(DoctorGuard)
    @Get()
    async avaragaRateForDoctor(
        @Req() req
    ) {
        const reviewed = await this.feedbackService.getAllReviewById(req.user.id)
        const rated = await this.feedbackService.getAverageRatingByDoctorId(req.user.id)
        return {
            data: {
                reviewed: reviewed,
                averageRating: rated.data.averageRating
            }
        }
    }
}