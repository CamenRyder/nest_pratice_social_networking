import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PostModule } from './post/post.module';
import { ReactPostModule } from './react-post/react-post.module';
import { CommentModule } from './comment/comment.module';
import { TrackingModule } from './tracking/tracking.module';
import { NotificationModule } from './notification/notification.module';
import { AdminModule } from './admin/admin.module';
import { IssueReportModule } from './issue_report/issue_report.module';
import { PostRestauransModule } from './post-restaurans/post-restaurans.module';

@Module({
  imports: [
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    AuthModule,
    ServeStaticModule.forRoot({ rootPath: '.' }),
    PostModule,
    ReactPostModule,
    CommentModule,
    TrackingModule,
    NotificationModule,
    AdminModule,
    IssueReportModule,
    PostRestauransModule,
  ],
})
export class AppModule {}
