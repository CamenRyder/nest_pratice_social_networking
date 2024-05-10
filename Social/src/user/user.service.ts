import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
const fs = require('fs');
import {
  ForgotPasswordDTO,
  UpdatePasswordDTO,
  UpdateUserInforDTO,
} from './dto/user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
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
      const filePath = user.url_avatar.replace(substringToRemove, '');
      fs.unlink(filePath, (err) => {
        if (err) {
          throw new ForbiddenException('Old file avatar couldnt delete');
        }
      });
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
