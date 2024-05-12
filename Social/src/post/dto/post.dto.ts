import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { isEmpty } from 'rxjs';

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
