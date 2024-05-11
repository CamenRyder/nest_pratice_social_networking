/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
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
  FileUploadDto,
  ForgotPasswordDTO,
  UpdatePasswordDTO,
  UpdateUserInforDTO,
} from './dto/user.dto';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
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
    return data;
  }

  // @UseGuards(MyJwtGuard)
  @Put('updateUserInfor/:user_id')
  updateUser(@Body() body: UpdateUserInforDTO, @Param('user_id') id: string) {
    return this.userService.updateUserInfor(body, parseInt(id));
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('updatePassword/:user_id')
  updatePassword(
    @Body() body: UpdatePasswordDTO,
    @Param('user_id') id: string,
  ) {
    return this.userService.updatePassword(body, parseInt(id));
  }

  @Post('forgotPassword')
  forgotPassword(@Body() body: ForgotPasswordDTO) {
    return this.userService.forgotPassword(body);
  }

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
          return callback(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  @Post('/upload-avatar/:user_id')
  uploadAva(
    @Param('user_id') userId: string,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({
          maxSize: 2000,
          message:
            'Nếu hiện chữ này báo ngay cho Hiếu. Có thể file này up lên hơi lớn?',
        })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
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
