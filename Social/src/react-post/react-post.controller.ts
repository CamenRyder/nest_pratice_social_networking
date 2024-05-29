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
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Tóm tắt api này làm gì nè' })
  @ApiOkResponse({ type: 'Trả về cái gì nè :>' })
  getTotalReact(@Param('post_id') postId: string) {
    //Params em cũng có thể viết dto đẻ thể hiện nó là dữ liệu gì nè
    try {
      return this.reactPostService.getTotalReact(postId);
    } catch (err) {
      //Này anh nhầm. Ghi log mới cần logger.
      throw new HttpException(
        `Lỗi BE {${this.getTotalReact.name} - ReactPostController} ${err}`,
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
