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

export class RemoveUserFollow {
  @ApiProperty({
    description: 'Đại loại thằng này chính là người dùng',
    type: Number,
  })
  @IsNumber()
  user_id: number;

  @ApiProperty({
    description: 'Muốn hủy theo dõi thằng người dùng này',
    type: Number,
  })
  @IsNumber()
  user_follower_id: number;
}
