/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { MyJwtGuard } from '../auth/guard/myjwt.guard';
import {
  CreateFollowUserDTO,
  FileUploadDto,
  ForgotPasswordDTO,
  SearchDTO,
  UpdatePasswordDTO,
  UpdateUserInforDTO,
} from './dto/user.dto';
import { diskStorage } from 'multer';
import {
  ApiBearerAuth,
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('me')
  me(@Req() req: Request) {
    const data = req['user'];
    // return data;
    return this.userService.userInfor(Number(data['user_id']));
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('update-infor-user/:user_id')
  updateUser(@Body() body: UpdateUserInforDTO, @Param('user_id') id: string) {
    return this.userService.updateUserInfor(body, parseInt(id));
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('create-following-a-user')
  followUser(@Body() data: CreateFollowUserDTO) {
    return this.userService.followUser(data);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('get-followee-yours/:user_id')
  getUserFollowing(@Param('user_id') user_id: string) {
    return this.userService.getUserFollowing(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('get-following-users/:user_id')
  getFollowingUser(@Param('user_id') user_id: string) {
    return this.userService.getFollowingUser(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('upgrade-account/:user_id')
  upgradeAccount(@Param('user_id') id: string) {
    return this.userService.upgradeAccount(id);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('Search-User')
  @ApiQuery({
    name: 'key',
    description:
      'Nhập chuỗi tìm kiếm, sẽ tìm kiếm các field {tên người dùng, tên quán , địa chỉ , số điện thoại và email} ',
  })
  searchUser(@Query('key') page: string) {
    return this.userService.searchUser(page);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('update-password/:user_id')
  updatePassword(
    @Body() body: UpdatePasswordDTO,
    @Param('user_id') id: string,
  ) {
    return this.userService.updatePassword(body, parseInt(id));
  }

  @Put('forgot-password')
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.userService.forgotPassword(body);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload avatar',
    type: FileUploadDto,
  })
  @UseInterceptors(
    FileInterceptor('fileUpload', {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          file.size;
          return callback(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  @Post('upload-avatar/:user_id')
  uploadAva(
    @Param('user_id') userId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({
          maxSize: 20000000,
          // message:
          //   'Nếu hiện chữ này báo ngay cho Hiếu. Có thể file này up lên hơi lớn?',
        })
        .build({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    file: Express.Multer.File,
  ) {
    try {
      return this.userService.saveAvatar(userId, file.filename);
    } catch (err) {
      throw new HttpException('Lỗi BE', 500);
    }
  }
}
