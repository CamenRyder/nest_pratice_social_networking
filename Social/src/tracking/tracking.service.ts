import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateFollowUserDTO,
  RemoveFollowerUser,
  RemoveFollowingUser,
} from './dto/tracking.dto';

@Injectable()
export class TrackingService {
  async removeUserFollowing(data: RemoveFollowingUser) {
    try {
      const currentTime = new Date();
      const isExist = await this.prismaService.follower.findFirst({
        where: {
          user_id: data.user_id,
          following_user_id: data.user_following_id,
        },
      });
      const isDelete = await this.prismaService.follower.delete({
        where: {
          follow_id: isExist.follow_id,
        },
      });
      if (isDelete) {
        return {
          message: 'Delete successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          // createFollowUser,
        };
      } //Đoạn này em không cần else đâu :> Vì nếu ở trên return rồi thì không chạy xuống dưới. Mà đã chạy xuống dưới thì cái trên false rồi.

      return {
        message: 'Something went wrong',
        statusCode: 202,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
  async removeUserFollow(data: RemoveFollowerUser) {
    try {
      const currentTime = new Date();
      const dataDelete = await this.prismaService.follower.findFirst({
        where: {
          user_id: data.user_follower_id, //
          following_user_id: data.user_id, //
        },
      });
      const isDelete = await this.prismaService.follower.delete({
        where: {
          follow_id: dataDelete.follow_id,
        },
      });
      
      if (isDelete) {
        return {
          message: 'Deleted successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
        };
      } else {
        return {
          message: 'Something went wrong, try again ',
          statusCode: 202,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
        };
      }
    } catch (err) {
      return {
        message: err,
      };
    }
  }
  async getFollowingUser(user_id: string) {
    try {
      const currentTime = new Date();
      const isExist = await this.prismaService.follower.findMany({
        where: {
          user_id: Number(user_id),
        },
        include: {
          User_Follower_following_user_idToUser: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });
      if (isExist) {
        return {
          message: 'You have been following User, query successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            following: isExist,
            total: isExist.length,
          },
          // createFollowUser,
        };
      } else
        return {
          message: 'No following yet',
          statusCode: 201,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            total: 0,
          },
        };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
  // get-follower-yours
  async getFollowerYours(user_id: string) {
    try {
      const currentTime = new Date();
      const isExist = await this.prismaService.follower.findMany({
        where: {
          following_user_id: Number(user_id),
        },
        include: {
          User_Follower_user_idToUser: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
        },
      });
      if (isExist) {
        return {
          message: 'User have been following u, query successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            followee: isExist,
            total: isExist.length,
          },
          // createFollowUser,
        };
      } else
        return {
          message: 'Chưa có người theo dõi',
          statusCode: 201,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            total: 0,
          },
        };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
  constructor(private prismaService: PrismaService) {}
  async followUser(data: CreateFollowUserDTO) {
    try {
      const currentTime = new Date();
      const isExist = this.prismaService.follower.findFirst({
        where: {
          user_id: data.user_id,
          following_user_id: data.user_follower_id,
        },
      });
      if (isExist) {
        const notification = await Promise.all([
          this.prismaService.user.findUnique({
            where: {
              user_id: data.user_follower_id,
            },
          }),
          this.prismaService.user.findUnique({
            where: {
              user_id: data.user_id,
            },
          }),
        ]);
        const userNotifyCation = notification[0];
        const userContact = notification[1];
        const isNotified = await this.prismaService.notification.findFirst({
          where: {
            user_id: userNotifyCation.user_id,
            Noti_type_id: 4,
            user_action_id: userContact.user_id,
          },
        });
        if (isNotified == null) {
          await this.prismaService.notification.create({
            data: {
              user_id: userNotifyCation.user_id,
              Noti_type_id: 4,
              user_action_id: userContact.user_id,
              title: `bạn có 1 người theo dõi mới`,
              description: `${userContact.fullname} đã theo dõi bạn.`,
              date: Date.now().toString(),
            },
          });
        } else {
          await this.prismaService.notification.delete({
            where: {
              noti_id: isNotified.noti_id,
            },
          });
          await this.prismaService.notification.create({
            data: {
              user_id: userNotifyCation.user_id,
              Noti_type_id: 4,
              user_action_id: userContact.user_id,
              title: `bạn có 1 người theo dõi mới`,
              description: `${userContact.fullname} đã theo dõi bạn.`,
              date: Date.now().toString(),
            },
          });
        }

        const createFollowUser = await this.prismaService.follower.create({
          data: {
            user_id: data.user_id,
            following_user_id: data.user_follower_id,
          },
        });

        return {
          message: 'Followed user successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          createFollowUser,
        };
      } else
        return {
          message: 'Followed this user previous',
          statusCode: 201,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
        };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
}
