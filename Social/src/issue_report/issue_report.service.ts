import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReportPostDTO } from './DTO/issue_report.dto';

@Injectable()
export class IssueReportService {
  constructor(private prismaService: PrismaService) {}
  async getIssueReport() {
    try {
      var currentTime = new Date();
      const issues = await this.prismaService.issues.findMany({});

      return {
        message: 'Get all issues successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          issues: issues,
          total: issues.length ?? 0,
        },
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async getIssuesUserTicked(user_id:number ,post_id: number) {
    try {
      var currentTime = new Date();
      const issuesUserTicked = await this.prismaService.report.findMany({
        where: {
          user_id: user_id,
          post_id: post_id,
        },
        include: {
            Issues:true ,

        }
      });
      return {
        message: 'Get all issues successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          ticked: issuesUserTicked,
        },
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
}
