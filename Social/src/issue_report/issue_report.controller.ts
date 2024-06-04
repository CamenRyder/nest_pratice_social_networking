import { Controller, Get, HttpException, Param, Query, UseGuards } from '@nestjs/common';
import { IssueReportService } from './issue_report.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';


@ApiTags('Issue Report')
@Controller('Issue-report')
export class IssueReportController {
  constructor(private readonly issueReportService: IssueReportService) {}

  @Get('get-issues')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  getAllNotification() {
    try {
      return this.issueReportService.getIssueReport(
      );
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.issueReportService} - get-all-notification} ${err}`,
        500,
      );
    }
  }

  @Get('get-issues-post/')
  getPostsAllUser(
    @Query('post_id') postId: string,
    @Query('user_id') userId: string,
  ) {
    try {
      return this.issueReportService.getIssuesUserTicked(Number(userId),Number(postId));
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {getPostAllUser - postController} ${error}`,
        500,
      );
    }
  }
}
