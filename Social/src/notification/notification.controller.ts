import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}
  @Get('get-new-notification/:user_id')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  getNewtNotificationByUserId(@Param('user_id') user_id: string) {
    try {
      return this.notificationService.getNewtNotificationByUserId(
        Number(user_id),
      );
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - get-new-notification} ${err}`,
        500,
      );
    }
  }

  @Get('get-all-notification/:user_id')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  getAllNotification(@Param('user_id') user_id: string) {
    try {
      return this.notificationService.getAllNotificationByUserId(
        Number(user_id),
      );
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - get-all-notification} ${err}`,
        500,
      );
    }
  }

  @Post('read-notification/:notification_id')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  readtNotification(@Param('notification_id') notification_id: string) {
    try {
      return this.notificationService.readNotification(Number(notification_id));
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - read-notificatio} ${err}`,
        500,
      );
    }
  }

  @Post('read-all-notification/:user_id')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  readAllNotification(@Param('user_id') user_id: string) {
    try {
      return this.notificationService.readAllNotification(Number(user_id));
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - read-all-notification} ${err}`,
        500,
      );
    }
  }
}
