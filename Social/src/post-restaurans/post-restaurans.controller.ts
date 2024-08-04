import { Body, Controller, Delete, Get, HttpException, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { PostRestauransService } from './post-restaurans.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreatePostUserDTOabc, DeletePostUserDTO, PostFromUserDTO, ReportPostDTO } from 'src/post/dto/post.dto';



@ApiTags('Post Restaurant')
@Controller('post-restaurans')
export class PostRestauransController {
  constructor(private readonly postRestauransService: PostRestauransService) {}

  
  @Get('view-posts/')
  getPostsAllUser(
    @Query('pageSize') pageSize: string,
    @Query('page') page: string,
  ) {
    try {
      // return this.postService.getPostAllUser(Number(page), Number(pageSize));
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
      // return this.postService.getPostFromUser(data);
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
      // return this.postService.deletePost(body);
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
      // return this.postService.reportPost(body);
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
    // return this.postService.createPostMultiple(user_id, files, description);
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
    // return this.postService.updatePostMultiple(post_id, files, description);
  }
  
}
