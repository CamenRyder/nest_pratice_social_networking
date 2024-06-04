import { Module } from '@nestjs/common';
import { IssueReportService } from './issue_report.service';
import { IssueReportController } from './issue_report.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IssueReportController],
  providers: [IssueReportService],
})
export class IssueReportModule {}
