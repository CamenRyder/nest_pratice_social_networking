import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Req,
  Request,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service';
import {
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express/multer';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FileUploadDto } from 'src/user/dto/user.dto';
import {
  CreatePostUserDTO,
  CreatePostUserDTOabc,
  DeletePostUserDTO,
  PostFromUserDTO,
  ReportPostDTO,
} from './dto/post.dto';
import { diskStorage } from 'multer';
import { TransformationType } from 'class-transformer';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { get } from 'http';

@ApiTags('Post User')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('view-posts/')
  getPostsAllUser(
    @Query('pageSize') pageSize: string,
    @Query('page') page: string,
  ) {
    try {
      return this.postService.getPostAllUser(Number(page), Number(pageSize));
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {getPostAllUser - postController} ${error}`,
        500,
      );
    }
  }
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('view-posts-user')
  getPostsFromUser(@Body() data: PostFromUserDTO) {
    try {
      return this.postService.getPostFromUser(data);
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {getPostsFromUser - postController]} ${error}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('delete-post')
  deleteYourPost(@Body() body: DeletePostUserDTO) {
    try {
      return this.postService.deletePost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - postController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('report-post')
  reportPost(@Body() body: ReportPostDTO) {
    try {
      return this.postService.reportPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - postController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('create-post/:user_id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          if (file == null) {
            return callback(null, '');
          }
          return callback(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  createPost(
    @Param('user_id') user_id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() description: CreatePostUserDTOabc,
  ) {
    return this.postService.createPostMultiple(user_id, files, description);
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('update-post/:post_id')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: process.cwd() + '/public/img',
        filename: (req, file, callback) => {
          if (file == null) {
            return callback(null, '');
          }
          return callback(null, Date.now() + '_' + file.originalname);
        },
      }),
    }),
  )
  updatePost(
    @Param('post_id') post_id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() description: CreatePostUserDTOabc,
  ) {
    return this.postService.updatePostMultiple(post_id, files, description);
  }
}
