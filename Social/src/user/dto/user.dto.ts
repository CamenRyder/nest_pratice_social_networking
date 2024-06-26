import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString } from 'class-validator';
import { BaseResponse } from 'src/base.dto';

export class UpdateUserInforDTO {
  @ApiProperty({
    description: 'Update your gender (1: woman , 0: man)',
    type: Number,
  })
  @IsNumber()
  gender: number;

  @ApiProperty({ description: 'Add Country', type: String })
  @IsString()
  country: string;

  // @ApiProperty({
  //   description: 'Update your gender (1: woman , 0: man)',
  //   type: Number,
  // })
  // @ApiProperty({ description: 'Add new age', type: Number })
  // @IsNumber()
  // age: number;

  @ApiProperty({ description: 'Add your language by string', type: String })
  @IsString()
  language: string;

  @ApiProperty({
    description: 'Fullname',
    type: String,
    default: 'New Name',
  })
  @IsString()
  fullname: string;
}

export class UpdatePasswordDTO {
  @ApiProperty({ description: 'Old password', type: String })
  @IsString()
  oldPassword: string;

  @ApiProperty({ description: 'New password', type: String })
  @IsString()
  newPassword: string;
}

export class ForgotPasswordDTO {
  @ApiProperty({ description: 'Your email', type: String })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Your name', type: String })
  @IsString()
  yourName: string;
}

export type fileDto = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export class InforByUserId {
  @ApiProperty({ description: 'Your email', type: Number })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'User id you want via his profile',
    type: Number,
  })
  @IsNumber()
  user_id_via: number;
}

export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  fileUpload: any;
}

export class SearchDTO {
  @ApiProperty({
    type: String,
    description:
      'Key là mấy cái như email , sđt , tên người dùng đều có thể search được',
  })
  keyword: string;
}

export class Response_UserInfo extends BaseResponse {
  @ApiProperty({type: Object, description: 'User info'})
  profile: any;

  constructor(data: any){
    super(data);
    this.profile = data.profile;
    // Okie
  }
}
