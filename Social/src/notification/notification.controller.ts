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
  getNotificationByUserId(@Param('user_id') user_id: string) {
    try {
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - ReactPostController} ${err}`,
        500,
      );
    }
  }

  @Get('get-all-notification/:user_id')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  getTotalReact(@Param('user_id') user_id: string) {
    try {
      return 'Tối t7 có';
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - ReactPostController} ${err}`,
        500,
      );
    }
  }

  @Post('read-notification/:notification_id')
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  readtNotification(@Param('user_id') user_id: string) {
    try {
      return 'Tối t7 cos';
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {${this.notificationService} - ReactPostController} ${err}`,
        500,
      );
    }
  }
}
