import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostUserDTO {
  @ApiProperty({ description: 'Your content post', type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  fileUpload: any;
}

export class UpdatePostDTO {
  @ApiProperty({ description: 'Your content update', type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  fileUpload: any;
}

export class PostFromUserDTO {
  @ApiProperty({
    description: 'User id to instance object',
    type: Number,
    default: 24,
  })
  @IsString()
  user_id: number;

  @ApiProperty({ description: 'Quanity of size ', type: Number, default: 10 })
  @IsString()
  page_size: number;

  @ApiProperty({ description: 'Your content update', type: Number, default: 1 })
  @IsString()
  page: number;
}

export class DeletePostUserDTO {
  @ApiProperty({ description: 'Your post_id you want delete', type: Number })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: Number,
    description: 'Your user_id , can get  on Token',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

export class ReportPostDTO {
  @ApiProperty({ description: 'post id you want report', type: Number })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: Number,
    description: 'Problem u want report post',
  })
  @IsNumber()
  @IsNotEmpty()
  issue_id: number;

  @ApiProperty({
    type: Number,
    description: 'user report post',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}