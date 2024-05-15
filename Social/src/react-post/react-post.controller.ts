import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReactPostService } from './react-post.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import {
  ChangeReactPostDTO,
  ReactPostDTO,
  RemoveReactPostDTO,
} from './dto/react.post.dto';

@ApiTags('React Post')
@Controller('react-post')
export class ReactPostController {
  constructor(private readonly reactPostService: ReactPostService) {}

  @Get('get-total-react/:post_id')
  getTotalReact(@Param('post_id') postId: string) {
    try {
      return this.reactPostService.getTotalReact(postId);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {getTotalReact - ReactPostController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('react-post')
  reactPost(@Body() body: ReactPostDTO) {
    try {
      return this.reactPostService.reactPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {reactPost - ReactPostController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('change-react')
  changeReactPost(@Body() body: ChangeReactPostDTO) {
    try {
      return this.reactPostService.changeReactPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {changeReactPost - ReactPostController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('remove-react')
  removeReactedPost(@Body() body: RemoveReactPostDTO) {
    try {
      return this.reactPostService.removeReactPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {removeReactedPost - ReactPostController} ${err}`,
        500,
      );
    }
  }
}
