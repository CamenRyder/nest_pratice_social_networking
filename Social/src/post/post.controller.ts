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
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from 'src/user/dto/user.dto';
import {
  ChangeReactPostDTO,
  CreatePostUserDTO,
  DeletePostUserDTO,
  PostFromUserDTO,
  ReactPostDTO,
  RemoveReactPostDTO,
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

  @Get('getPostAllUser/')
  getPostsAllUser(
    @Query('pageSize') pageSize: string,
    @Query('page') page: string,
  ) {
    try {
      return this.postService.getPostAllUser(Number(page), Number(pageSize));
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostAllUser} ${error}`,
        500,
      );
    }
  }
  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('getPostFromUser/:user_id')
  getPostsFromUser(@Body() data: PostFromUserDTO) {
    try {
      return this.postService.getPostFromUser(data);
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('/create-post/:user_id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'create post with content and image',
    type: CreatePostUserDTO,
  })
  @UseInterceptors(
    FileInterceptor('fileUpload', {
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
  createYourPost(
    @Param('user_id') userId: string,
    @Body() createDTO: CreatePostUserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({
          maxSize: 20000000,
          // message:
          //   'Nếu hiện chữ này báo ngay cho Hiếu. Có thể file này up lên hơi lớn?',
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (file == null) {
        return this.postService.createPost(userId, '', createDTO.description);
      }
      return this.postService.createPost(
        userId,
        file.filename,
        createDTO.description,
      );
    } catch (err) {
      throw new HttpException('Lỗi BE {createYourPost - postController}', 500);
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('updatePost/:user_id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'create post with content and image',
    type: CreatePostUserDTO,
  })
  @UseInterceptors(
    FileInterceptor('fileUpload', {
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
  updateYourPost(
    @Param('post_id') postId: string,
    @Body() createDTO: CreatePostUserDTO,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .addMaxSizeValidator({
          maxSize: 20000000,
        })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    )
    file: Express.Multer.File,
  ) {
    try {
      if (file == null) {
        return this.postService.createPost(postId, '', createDTO.description);
      }
      return this.postService.createPost(
        postId,
        file.filename,
        createDTO.description,
      );
    } catch (err) {
      throw new HttpException('Lỗi BE {createYourPost - postController}', 500);
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('delete-post/:user_id')
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
  @Post('reactPost')
  reactPost(@Body() body: ReactPostDTO) {
    try {
      return this.postService.reactPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - postController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('changeReactPost')
  changeReactPost(@Body() body: ChangeReactPostDTO) {
    try {
      return this.postService.changeReactPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - postController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('removeReactedPost')
  removeReactedPost(@Body() body: RemoveReactPostDTO) {
    try {
      return this.postService.removeReactPost(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - postController} ${err}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('reportPost')
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
}
