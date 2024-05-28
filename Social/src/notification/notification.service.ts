import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prismaService: PrismaService) {}

  async getNewtNotificationByUserId(user_id: number) {
    try {
      var currentTime = new Date();
      const newNotification = await this.prismaService.notification.findMany({
        where: {
          user_id: user_id,
          is_seen: 0,
        },
      });

      return {
        message: 'Get new notification successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          'new notifcations': newNotification,
          total: newNotification.length ?? 0,
        },
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async getAllNotificationByUserId(user_id: number) {
    try {
      var currentTime = new Date();
      const allNotification = await this.prismaService.notification.findMany({
        where: {
          user_id: user_id,
        },
      });

      return {
        message: 'Get all notification successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          'all notifcations': allNotification,
          total: allNotification.length ?? 0,
        },
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async readNotification(notification_id: number) {
    try {
      var currentTime = new Date();
      const updateNotification = await this.prismaService.notification.update({
        where: {
          noti_id: notification_id,
        },
        data: {
          is_seen: 1,
        },
      });

      return {
        message: 'read information successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          'information read': updateNotification,
        },
      };
    } catch (err) {
      return {
        messageSystem: "Báo BE nếu api này báo lỗi 500" , 
        messageError: err,
      };
    }
  }

  async readAllNotification(user_id: number ) {
    try{
        var currentTime = new Date();
        const updateNotification = await this.prismaService.notification.updateMany({
          where: {
            user_id: user_id,
          },
          data: {
            is_seen: 1,
          },
        });
  
        return {
          message: 'read all information successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            'information read all': updateNotification,
          },
        };
    }catch(err)
    {
        return {
            messageSystem: "Báo BE nếu api này báo lỗi 500" , 
            messageError: err,
          };
    }
  }
}
