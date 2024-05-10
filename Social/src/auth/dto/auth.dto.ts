/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({ description: 'Email', type: String , default: 'user010@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', type: String  , default: 'abc@123'})
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Fullname',
    type: String,
    default: 'Ryder',
  })
  @IsString()
  fullname: string;
}

export class LoginDTO {
  @ApiProperty({
    description: 'Email',
    type: String,
    default: 'user010@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Password', type: String, default: 'abc@123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
