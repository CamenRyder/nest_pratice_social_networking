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
import { CreateFollowUserDTO, RemoveUserFollow } from './dto/tracking.dto';

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
  @Get('get-followee-yours/:user_id')
  getUserFollowing(@Param('user_id') user_id: string) {
    return this.trackingService.getUserFollowing(user_id);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Get('get-following-users/:user_id')
  getFollowingUser(@Param('user_id') user_id: string) {
    return this.trackingService.getFollowingUser(user_id);
  }

  // @ApiBearerAuth()
  // @UseGuards(MyJwtGuard)
  // @Delete('remove-follow-user')
  // removeFollowUser(@Body() data: RemoveUserFollow) {
  //   return this.trackingService.removeUserFollow(data);
  // }

  // @ApiBearerAuth()
  // @UseGuards(MyJwtGuard)
  // @Delete('remove-user-following')
  // removeUserFollowing(@Body() data: RemoveUserFollow) {
  //   return this.trackingService.removeUserFollowing(data);
  // }
}
