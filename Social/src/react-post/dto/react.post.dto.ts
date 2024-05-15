import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReactPostDTO {
  @ApiProperty({ description: 'post id you want to React', type: Number })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: Number,
    description:
      'Like_state inclule: {1: Like ,  2: disLike , 3: wow , 4: haha , 5: angry => another default like{1} }',
  })
  @IsNumber()
  @IsNotEmpty()
  like_state: number;

  @ApiProperty({
    type: Number,
    description: 'user report post',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

export class RemoveReactPostDTO {
  @ApiProperty({ description: 'post id you want to remove', type: Number })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: Number,
    description: 'user remove react post',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}

export class ChangeReactPostDTO {
  @ApiProperty({
    description: 'post id you want to Change react :V',
    type: Number,
  })
  @IsNumber()
  @IsNotEmpty()
  post_id: number;

  @ApiProperty({
    type: Number,
    description:
      'Like_state inclule: {1: Like ,  2: disLike , 3: wow , 4: haha , 5: angry => another default like{1} }',
  })
  @IsNumber()
  @IsNotEmpty()
  like_state: number;

  @ApiProperty({
    type: Number,
    description: 'user change reactPost post',
  })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;
}
