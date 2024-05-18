import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCommentUserDTO {
  @ApiProperty({ description: 'Your content post', type: String })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Post instance of your comment', type: Number })
  @IsString()
  post_top_id: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  fileUpload: any;
}

export class UpdateCommentUserDTO {
  @ApiProperty({ description: 'Your content post', type: String })
  @IsString()
  description: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  fileUpload: any;
}

// export class UpdatePostDTO {
//   @ApiProperty({ description: 'Your content update', type: String })
//   @IsString()
//   description: string;

//   @ApiProperty({ type: 'string', format: 'binary' })
//   fileUpload: any;
// }

export class AllCommentPostDTO {
  @ApiProperty({
    description: 'Post id to instance object',
    type: Number,
    default: 24,
  })
  @IsString()
  post_id: number;

  @ApiProperty({ description: 'Quanity of size ', type: Number, default: 10 })
  @IsString()
  page_size: number;

  @ApiProperty({ description: 'Your content update', type: Number, default: 1 })
  @IsString()
  page: number;
}

export class DeleteCommentPostDTO {
  @ApiProperty({
    description: 'Your post_id comment you want delete',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: Number,
    description: 'Your user_id , that own your comment  to delete',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
