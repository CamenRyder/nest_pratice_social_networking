import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prismaService: PrismaService) {}

  async rejctedAccountUpgrade(user_id: number) {
    try {
      var currentTime = new Date();
      const data = await this.prismaService.browsingAccount.findFirst({
        where: {
          user_id: user_id,
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });

      const updateData = await this.prismaService.browsingAccount.update({
        where: {
          browsing_account_id: data.browsing_account_id,
        },
        data: {
          account_state_id: 3,
        },
      });
      if (updateData != null) {
        await this.prismaService.notification.create({
          data: {
            // lỗi
            user_id: user_id,
            // user_action_id: Number(userId),
            // post_id: data.post_top_id,
            Noti_type_id: 5,
            title: `Thông báo hệ thống`,
            description: `Chúc mừng tài khoản ${data.User.fullname} đã bị hệ thống từ chối nâng cấp.`,
            date: Date.now().toString(),
          },
        });
      }
      return {
        message: 'Rejected successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: updateData,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async acceptedAccountUpgrade(user_id: number) {
    try {
      var currentTime = new Date();
      const data = await this.prismaService.browsingAccount.findFirst({
        where: {
          user_id: user_id,
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });

      const updateData = await this.prismaService.browsingAccount.update({
        where: {
          browsing_account_id: data.browsing_account_id,
        },
        data: {
          account_state_id: 2,
        },
      });
      if (updateData != null) {
        await this.prismaService.notification.create({
          data: {
            // lỗi
            user_id: user_id,
            // user_action_id: Number(userId),
            // post_id: data.post_top_id,
            Noti_type_id: 5,
            title: `Thông báo hệ thống`,
            description: `Chúc mừng tài khoản ${data.User.fullname} đã được nâng cấp thành chủ quán.`,
            date: Date.now().toString(),
          },
        });
      }
      return {
        message: 'Rejected successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: updateData,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async getViewUserWaitingToAccept(page: number, pageSize: number) {
    try {
      var currentTime = new Date();
      const offset = (page - 1) * 10;
      const data = await this.prismaService.browsingAccount.findMany({
        take: pageSize,
        skip: offset,
        orderBy: {
          create_at: 'desc',
        },
        where: {
          account_state_id: 1,
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });

      return {
        message: 'Update successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: data,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async viewListReportWaitingToAccept(page: number, pageSize: number) {
    try {
      var currentTime = new Date();
      const offset = (page - 1) * 10;
      const data = await this.prismaService.report.findMany({
        take: pageSize,
        skip: offset,
        orderBy: {
          dateReported: 'desc',
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });

      return {
        message: 'Update successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: data,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }
  async viewListRejectToRestaurant(page: number, pageSize: number) {
    try {
      var currentTime = new Date();
      const offset = (page - 1) * 10;
      const data = await this.prismaService.browsingAccount.findMany({
        take: pageSize,
        skip: offset,
        orderBy: {
          create_at: 'desc',
        },
        where: {
          account_state_id: 3,
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });

      return {
        message: 'list rejected account become upgrade successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: data,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async viewListAcceptedUpgradeAccount(page: number, pageSize: number) {
    try {
      var currentTime = new Date();
      const offset = (page - 1) * 10;
      const data = await this.prismaService.browsingAccount.findMany({
        take: pageSize,
        skip: offset,
        orderBy: {
          create_at: 'desc',
        },
        where: {
          account_state_id: 2,
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });

      return {
        message: 'list accepted account become upgrade successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: data,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }
}
