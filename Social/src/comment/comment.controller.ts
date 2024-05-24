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

  // @ApiBearerAuth()
  // @UseGuards(MyJwtGuard)
  @Post('view-comment-post')
  getCommentFormPost(@Body() data: AllCommentPostDTO) {
    try {
      return this.commentService.getCommentFromPost(data);
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
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg|zip)' })
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
      // Này anh chưa đụng upload file bao giờ :>  Thôi tự mò đoạn này nhen.
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

  // Với lại hạn chế để comment code cũ nè. Xóa bớt cho đỡ sợ :>
  // Nhiều lúc để code cũ rồi người khác đọc tưởng nó để làm gì.
  // PMS nó hơi phèn :v. Thì nó viết theo Rest ấy, và vì cái convention nó không rõ hoặc không đọc nên mấy cái code convention vi phạm nhiều lắm :>
  // Và PMS nó cũng phức tạp vì chạy microservice. Gateway - Redis -  Service. Nên nó sẽ khó hiểu lắm.
  // Cuối cùng là comment nhưng nhiều cái comment sai nhưng mấy anh chả bỏ :>> Vô code theo cái comment hồi lú vcl.
  // Mà anh chắc hết cái để nói rồi. Hiện tại nếu source em nhỏ quá thì viết thẳng service lên controller cũng đc. Cái này là Service Pattern.
  // Còn nếu làm kĩ thì làm như thằng PMS là Repo pattern + service pattern. 
  // Service phụ trách bussiness. Còn Repo phụ trách phần kết nối db. 
  // À interface ấy à. Nó cũng không hoàn toàn giống repo pattern đâu. Repo pattern như em nói phải có interface rồi phát triển dựa trên interface đó thì đúng á. Nhưng mà vì cái bussiness mình bự quá hay sao mà mấy anh không làm như thế hay không viết cái interface cho repo nổi. Này anh cũng hem biết :v
  // Viết theo kiểu đó thì clean hơn thôi :v. Nó theo SOLID ấy.
  // Này anh cũng hem biết nữa. Anh chưa nghe thông báo chính thức nào về DMS cả.
  // Toàn nghe qua anh Thanh thôi.
  // Btw, em có thể xài thằng Github codespaces ấy. Đỡ phải thuê vps :>
  // Nói chung anh thấy có free nên rec cho em thôi :v Chứ vps nhiều lúc trả phí hơi chuối. Nhưng đổi lại VPS em toàn quyền. Còn thằng codespace nó không có thoải mái bằng.
  // Hẻ. Em nói gì. Thằng Highland mở nhạc to quá :>
  // Đúng zồi em :>

  // Thì nói chung codespace free thôi. Ngoài ra còn thằng gitpod nữa. Nhưng anh chưa thử.
  // Btw thôi anh nghỉ đây. Anh thấy code em cũng đc rồi á. Thêm mấy cái anh chỉ thì xịn hơn thôi.
  // Ai cũng thế thôi :>
  // Okie. Thôi anh off nhen.
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
