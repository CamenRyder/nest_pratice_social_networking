import { Controller, Get, HttpException, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get('view-list-user-waiting-to-accept')
  viewListUSerWaitingToAccept() {
    try {
      return this.adminService.getCommentFromPost(data);
      return "Tối t4 có"
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }



  @Get('view-list-report-waiting-to-accept')
  viewListReportWaitingToAccept() {
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




  @Get('view-list-reject-upgrade-to-restaurant')
  viewListRejectToRestaurant() {
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




  @Get('view-list-rejected-report-post')
    asdhakjhk() {
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


  @Get('view-list-accepted-upgrade-account')
  vieejectToRestaurant() {
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


  @Post('accept-upgrade-account')
  viewListReject() {
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


  @Post('reject-upgrade-account')
  iewListReject() {
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





  @Post('ban-post-user')
  viewLiReject() {
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


  @Post('unlock-post-user')
  iewListect() {
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
