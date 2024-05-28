import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import {
  CreateFollowUserDTO,
  RemoveFollowerUser,
  RemoveFollowingUser,
} from './dto/tracking.dto';

@ApiTags('Tracking')
@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('create-following-a-user')
  followUser(@Body() data: CreateFollowUserDTO) {
    return this.trackingService.followUser(data);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('get-follower-yours/:user_id')
  getUserFollowing(@Param('user_id') user_id: string) {
    return this.trackingService.getFollowerYours(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('get-following-users/:user_id')
  getFollowingUser(@Param('user_id') user_id: string) {
    return this.trackingService.getFollowingUser(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('remove-follower-user')
  removeFollowUser(@Body() data: RemoveFollowerUser) {
    return this.trackingService.removeUserFollow(data);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('remove-following-user')
  removeUserFollowing(@Body() data: RemoveFollowingUser) {
    return this.trackingService.removeUserFollowing(data);
  }
}
