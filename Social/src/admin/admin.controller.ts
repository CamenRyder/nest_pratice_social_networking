import { Controller } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';





@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {


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








  }
}
