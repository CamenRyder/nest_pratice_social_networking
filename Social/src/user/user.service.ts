import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
import {
  ForgotPasswordDTO,
  InforByUserId,
  Response_UserInfo,
  UpdatePasswordDTO,
  UpdateUserInforDTO,
} from './dto/user.dto';
import * as argon from 'argon2';
import { CreateFollowUserDTO } from 'src/tracking/dto/tracking.dto';

@Injectable()
export class UserService {
  async userInforByUserId(data: InforByUserId) {
    try {
      const currentTime = new Date();
      const totalFollowing = await this.prismaService.follower.count({
        where: {
          user_id: data.user_id_via,
        },
      });
      const totalFollowee = await this.prismaService.follower.count({
        where: {
          following_user_id: data.user_id_via,
        },
      });
      const yourFollowThisAccount = await this.prismaService.follower.count({
        where: {
          user_id: data.user_id,
          following_user_id: data.user_id_via,
        },
      });
      const profile = await this.prismaService.user.findFirst({
        where: {
          user_id: data.user_id_via,
        },
        select: {
          fullname: true,
          email: true,
          url_avatar: true,
          url_background_profile: true,
        },
      });

      // Chỗ này nếu được thì em nên chơi Promise.all thay vì nhiều await.
      // Vì nhiều await thì nó phải đợi await này xong mới tới await khác. => lâu.
      // Promise.all thì nó chạy đồng thời cả đám luôn

      // Ví dụ nè:
      // Như thế này thì em vẫn lấy được. Nhưng nhớ nó có thứ tự nhen
      
      // const [totalFollowing, totalFollowee, yourFollowThisAccount, profile] = await Promise.all([
      //   this.prismaService.follower.count({where: {
      //     user_id: data.user_id_via,
      //   },}), => totalFollowing
      //   // query 2, => totalFollowee
      //   // query 3, => yourFollowThisAccount
      //   // query 4, => profile
      // ])


      profile['total_following'] = totalFollowing;
      profile['total_followee'] = totalFollowee;
      profile['is_follow_this_profile'] = yourFollowThisAccount ? true : false;
      // Ý em là ghi lại nhiều quá à/
      // Chỗ này thì em có thể dùng DTO. Có mấy cái có thể viết sẵn như createAt nè, status code mặc định, v.v
      // Chỗ này anh nghĩ trước tiên là em làm 1 cái dto base. Xong rồi các dto khác sẽ kế thừa dto này.
      // Thế là mặc định mấy cái dto sau có sẵn trường như message, statusCode, hay createAt rồi. Em thêm phần data vô thôi
      // Đúng rồi. Base dto.
      // return {
      //   message: 'Successful',
      //   statusCode: 200,
      //   createAt: currentTime.toLocaleString('en-US', {
      //     timeZone: 'Asia/Ho_Chi_Minh',
      //     hour12: false,
      //   }),
      //   profile,
      // };
      // Neu em muon thay message thi
      // Request , param hay query deu lam dc nhen.
      // Anh nghe chua ro lam. Cai Base này cơ bản là để em hạn chế viết lại thôi. Em viết như trước cũng đc. Nhưng mà nó kiểu em phải viết lại nhiều thì khó chịu thôi.
      // Còn CRUD hay không thì tùy em ứng dụng ấy. Cái field createAt của em thì nó bị 
      // Còn tùy vào exception ấy em. Ví dụ lỗi hệ thống thì em nên trả throw. Còn lỗi người dùng thì cái nào cũng đc. Nhưng anh vẫn nghiên qua throw hơn để đồng bộ.
      const something = {profile: profile, message: 'Something'}
      return new Response_UserInfo(something); 
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }
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
      // Nếu em throw thì anh không chắc. Này em đọc doc của Nest thử. Nhưng mà nếu em trả response thì được.
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
      const totalFollowing = await this.prismaService.follower.count({
        where: {
          user_id: user_id,
        },
      });
      const totalFollowee = await this.prismaService.follower.count({
        where: {
          following_user_id:user_id,
        },
      });
      const yourFollowThisAccount = await this.prismaService.follower.count({
        where: {
          user_id: user_id,
          following_user_id: user_id,
        },
      });
      const profile = await this.prismaService.user.findFirst({
        where: {
          user_id: user_id,
        },
        select: {
          fullname: true,
          email: true,
          url_avatar: true,
          url_background_profile: true,
        },
      });

      profile['total_following'] = totalFollowing;
      profile['total_followee'] = totalFollowee;
      profile['is_follow_this_profile'] = yourFollowThisAccount ? true : false;
      return {
        message: 'Successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        profile,
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
  // Tại sao constructor ở đây :>>
  // À do thằng vscode tự gen ở trên à. Này anh cũng gặp mà không kiếm ra cách tắt. Nên anh bay qua IDEA ngồi code :>
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

  async updateBackgroundProfile(userId: string, imgName: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        user_id: Number(userId),
      },
    });
    const substringToRemove = 'http://camenryder.xyz/';
    // const url1 = 'http://localhost:8888/public/img/' + imgName;
    const url2 = 'http://camenryder.xyz/public/img/' + imgName;
    if (user.url_background_profile != null) {
      if (
        user.url_background_profile !=
        'http://camenryder.xyz/public/img/avatar_default.png'
      ) {
        const filePath = user.url_avatar.replace(substringToRemove, '');
        fs.unlink(filePath, (err) => {
          if (err) {
            throw new ForbiddenException('Old file avatar couldnt delete');
          }
        });
      }
    }
    user.url_background_profile = url2;
    const data = await this.prismaService.user.update({
      data: user,
      where: {
        user_id: Number(userId),
      },
    });
    const currentDate = new Date();
    return {
      statusCode: 200,
      message: 'Update background profile successful !',
      dateTime: currentDate.toLocaleString(),
      data: data,
    };
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
