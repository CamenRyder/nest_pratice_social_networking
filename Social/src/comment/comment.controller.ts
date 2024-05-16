import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MyJwtGuard } from 'src/auth/guard/myjwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {
  AllCommentPostDTO,
  CreateCommentUserDTO,
  DeleteCommentPostDTO,
  UpdateCommentUserDTO,
} from './dto/comment.dto';

@ApiTags('Comment Post')
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('view-comment-post')
  getCommentFormPost(@Body() data: AllCommentPostDTO) {
    try {
      return this.commentService.getPostFromPost(data);
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Post('create-comment/:user_id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'create comment with content and image',
    type: CreateCommentUserDTO,
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
  createComment(
    @Param('user_id') userId: string,
    @Body() createCommentDTO: CreateCommentUserDTO,
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
        return this.commentService.createComment(userId, '', createCommentDTO);
      }
      return this.commentService.createComment(
        userId,
        file.filename,
        createCommentDTO,
      );
    } catch (err) {
      throw new HttpException(
        'Lỗi BE {createComment - commentController}',
        500,
      );
    }
  }

  // @ApiBearerAuth()
  // @UseGuards(MyJwtGuard)
  // @Put('edit-comment/:post_id')
  // @ApiConsumes('multipart/form-data')
  // @ApiBody({
  //   description: 'create post with content and image',
  //   type: CreateCommentUserDTO,
  // })
  // @UseInterceptors(
  //   FileInterceptor('fileUpload', {
  //     storage: diskStorage({
  //       destination: process.cwd() + '/public/img',
  //       filename: (req, file, callback) => {
  //         if (file == null) {
  //           return callback(null, '');
  //         }
  //         return callback(null, Date.now() + '_' + file.originalname);
  //       },
  //     }),
  //   }),
  // )
  // editComment(
  //   @Param('post_id') postId: string,
  //   @Body() createDTO: CreateCommentUserDTO,
  //   @UploadedFile(
  //     new ParseFilePipeBuilder()
  //       .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
  //       .addMaxSizeValidator({
  //         maxSize: 20000000,
  //       })
  //       .build({
  //         fileIsRequired: false,
  //         errorHttpStatusCode: HttpStatus.BAD_REQUEST,
  //       }),
  //   )
  //   file: Express.Multer.File,
  // ) {
  //   try {
  //     if (file == null) {
  //       return this.commentService.updateComment(
  //         postId,
  //         '',
  //         createDTO.description,
  //       );
  //     }
  //     return this.commentService.updateComment(
  //       postId,
  //       file.filename,
  //       createDTO.description,
  //     );
  //   } catch (err) {
  //     throw new HttpException(
  //       'Lỗi BE {updateComment - commentController}',
  //       500,
  //     );
  //   }
  // }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Put('update-comment/:post_id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'update comment again with content and image',
    type: UpdateCommentUserDTO,
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
  updateComment(
    @Param('post_id') postId: string,
    @Body() updateDTO: UpdateCommentUserDTO,
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
        return this.commentService.updateComment(
          postId,
          '',
          updateDTO.description,
        );
      }
      return this.commentService.updateComment(
        postId,
        file.filename,
        updateDTO.description,
      );
    } catch (err) {
      throw new HttpException(
        'Lỗi BE {updateComment - commentController}',
        500,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(MyJwtGuard)
  @Delete('delete-comment')
  deleteComment(@Body() body: DeleteCommentPostDTO) {
    try {
      return this.commentService.deleteComment(body);
    } catch (err) {
      throw new HttpException(
        `Lỗi BE {deleteComment - commentController} ${err}`,
        500,
      );
    }
  }
}
