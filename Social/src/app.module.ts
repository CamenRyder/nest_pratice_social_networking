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
  ],
})
export class AppModule {}
