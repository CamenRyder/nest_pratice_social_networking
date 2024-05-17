import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
import {
  CreateFollowUserDTO,
  ForgotPasswordDTO,
  UpdatePasswordDTO,
  UpdateUserInforDTO,
} from './dto/user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  // người đang theo dõi mình
  async getUserFollowing(user_id: string) {
    try {
      const currentTime = new Date();
      const isExist = await this.prismaService.follower.findMany({
        where: {
          following_user_id: Number(user_id),
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
      if (!isExist) {
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
          message: 'Call BE with error if u see that :))',
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
  // người mình đang theo dõi
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
      if (!isExist) {
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
          message: 'Call BE with error if u see that :))',
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
  async followUser(data: CreateFollowUserDTO) {
    try {
      const currentTime = new Date();
      const isExist = this.prismaService.follower.findFirst({
        where: {
          user_id: data.user_id,
          following_user_id: data.user_follower_id,
        },
      });
      if (!isExist) {
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
  async upgradeAccount(id: string) {
    try {
      const currentTime = new Date();
      const isExist = this.prismaService.browsingAccount.findFirst({
        where: {
          user_id: Number(id),
        },
      });
      if (!isExist || (await isExist).account_state_id == 2) {
        const createdQueueAccount =
          await this.prismaService.browsingAccount.create({
            data: {
              user_id: Number(id),
              create_at: Date.now().toString(),
              account_state_id: 1,
            },
          });
        return {
          message: 'Waiting system accept your request',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          createdQueueAccount,
        };
      } else
        return {
          message:
            'Existed request in dashboard or upgraded restaurant successful',
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
  async userInfor(user_id: number) {
    try {
      const currentTime = new Date();
      const data = await this.prismaService.user.findFirst({
        where: {
          user_id: user_id,
        },
        include: {
          Post: {
            include: {
              PostImage: true,
              ReactPost: true,
            },
          },
        },
      });
      return {
        message: 'Successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data,
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
  async searchUser(key: string) {
    try {
      const keyWord = key;

      const queryTemplate = (field, keyWord) => {
        return this.prismaService.user.findMany({
          where: {
            [field]: {
              contains: keyWord,
            },
          },
          select: {
            user_id: true,
            fullname: true,
            email: true,
            phone: true,
            url_avatar: true,
          },
        });
      };
      const queries = [
        queryTemplate('fullname', keyWord),
        queryTemplate('email', keyWord),
        queryTemplate('phone', keyWord),
      ];
      const results = await Promise.all(queries);
      const combinedList = results[0].concat(results[1], results[2]);
      const uniqueList = combinedList.reduce((acc, current) => {
        const isExist = acc.some((item) => item.user_id === current.user_id);
        if (!isExist) {
          acc.push(current);
        }
        return acc;
      }, []);
      return {
        message: 'Create successful',
        statusCode: 200,
        createAt: new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          result: uniqueList,
        },
      };
    } catch (error) {
      return {
        message: {
          error,
        },
      };
    }
  }
  constructor(private prismaService: PrismaService) {}

  async updateUserInfor(data: UpdateUserInforDTO, id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          user_id: id,
        },
      });
      if (!user) {
        throw new ForbiddenException('User not found');
      }

      const dataUpdate = { ...user };
      dataUpdate.fullname = data.fullname ?? user.fullname;
      dataUpdate.country = data.country ?? user.country;
      dataUpdate.gender = data.gender ?? user.gender;
      dataUpdate.language = data.language ?? user.language;
      const isUpdate = await this.prismaService.user.update({
        where: { user_id: id },
        data: dataUpdate,
      });
      delete dataUpdate.hash_password;
      const currentDate = new Date();
      return {
        statusCode: 200,
        message: 'Update succesful',
        dateTime: currentDate.toLocaleString(),
        data: isUpdate,
      };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async forgotPassword(data: ForgotPasswordDTO) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          email: data.email,
        },
      });
      if (!user) {
        throw new ForbiddenException('Email not exit');
      }
      if (user.fullname == data.yourName) {
        const randomNumber = Math.floor(Math.random() * 500) + 1;
        const newPassword = 'asakjn' + randomNumber;
        const hasedNewPassword = await argon.hash(newPassword);
        const userUpdate = { ...user };
        userUpdate.hash_password = hasedNewPassword;
        const updated = await this.prismaService.user.update({
          where: { user_id: user.user_id },
          data: userUpdate,
        });
        delete updated.hash_password;
        return {
          message: 'Your new password',
          data: {
            newPassword: newPassword,
            user: updated,
          },
        };
      } else {
        throw new ForbiddenException('Your name not match');
      }
    } catch (err) {
      return err;
    }
  }
  async saveAvatar(userId: string, imgName: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        user_id: Number(userId),
      },
    });
    const substringToRemove = 'http://camenryder.xyz/';
    // const url1 = 'http://localhost:8888/public/img/' + imgName;
    const url2 = 'http://camenryder.xyz/public/img/' + imgName;
    if (user.url_avatar != null) {
      if (
        user.url_avatar != 'http://camenryder.xyz/public/img/avatar_default.png'
      ) {
        const filePath = user.url_avatar.replace(substringToRemove, '');
        fs.unlink(filePath, (err) => {
          if (err) {
            throw new ForbiddenException('Old file avatar couldnt delete');
          }
        });
      }
    }
    user.url_avatar = url2;
    await this.prismaService.user.update({
      data: user,
      where: {
        user_id: Number(userId),
      },
    });

    return 'Upload thành công !';
  }

  async updatePassword(data: UpdatePasswordDTO, id: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          user_id: id,
        },
      });
      if (!user) {
        throw new ForbiddenException('User not found');
      }
      if (data.newPassword == data.oldPassword) {
        throw new ForbiddenException('New Password same with Old Password');
      }

      const passwordMatched = await argon.verify(
        user.hash_password,
        data.oldPassword,
      );

      if (!passwordMatched) {
        throw new ForbiddenException('Old Password not match');
      }
      const hasedNewPassword = await argon.hash(data.newPassword);

      const dataUpdate = { ...user };
      dataUpdate.hash_password = hasedNewPassword;

      const isUpdate = await this.prismaService.user.update({
        where: { user_id: id },
        data: dataUpdate,
      });
      delete isUpdate.hash_password;

      const currentDate = new Date();
      return {
        statusCode: 200,
        message: 'Update succesful',
        dateTime: currentDate.toLocaleString(),
        data: isUpdate,
      };
    } catch (err) {
      return err;
    }
  }
}
