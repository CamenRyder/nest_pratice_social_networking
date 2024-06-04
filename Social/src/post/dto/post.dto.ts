import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostUserDTO {
  @ApiProperty({ description: 'Your content post', type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  fileUpload: any;
}

export class CreatePostUserDTOabc {
  @ApiProperty({ type: 'string', required: false })
  description: string;
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
    default: 23,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Quanity of size ', type: Number, default: 10 })
  @IsNumber()
  page_size: number;

  @ApiProperty({ description: 'Your content update', type: Number, default: 1 })
  @IsNumber()
  page: number;
}

export class DeletePostUserDTO {
  @ApiProperty({
    description: 'Your post_id you want delete',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    description: 'Your user_id , can get  on Token',
    required: false,
  })
  user_id: number;
}

export class ReportPostDTO {
  @ApiProperty({ description: 'post id you want report', type: Number })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: [Number],
    description: 'Problem u want report post',
  })
  issue_id: [number];

  @ApiProperty({
    type: Number,
    description: 'user report post',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
