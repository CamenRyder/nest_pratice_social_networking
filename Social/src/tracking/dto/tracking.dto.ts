import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateFollowUserDTO {
  @ApiProperty({
    description: 'Đại loại thằng này chính là người dùng',
    type: Number,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Muốn theo dõi thằng người dùng này',
    type: Number,
  })
  @IsNumber()
  user_follower_id: number;
}

export class RemoveFollowerUser {
  @ApiProperty({
    description: 'id chính chủ',
    type: Number,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Follower {người đang theo dõi chính chủ } ',
    type: Number,
  })
  @IsNumber()
  user_follower_id: number;
}


export class RemoveFollowingUser {
  @ApiProperty({
    description: 'id chính chủ',
    type: Number,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Following {id chính chủ đang theo dõi  } ',
    type: Number,
  })
  @IsNumber()
  user_following_id: number;
}

