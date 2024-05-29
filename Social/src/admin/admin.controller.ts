import { Controller, Get, HttpException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('view-list-user-waiting-to-accept')
  viewListUSerWaitingToAccept() {
    try {
      // return this.adminService.getCommentFromPost(data);
      return "Tối t4 có"
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }


  
  viewListReportPost() {
    try {
      // return this.adminService.getCommentFromPost(data);
      return "Tối t4 có"
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }
}
