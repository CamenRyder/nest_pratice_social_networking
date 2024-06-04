import { Controller, Get, HttpException, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}


  @Get('view-list-user-waiting-to-accept')
  getPostsAllUser(
    @Query('pageSize') pageSize: string,
    @Query('page') page: string,
  ) {
    try {
      return this.adminService.getViewUserWaitingToAccept(Number(page), Number(pageSize));
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {getViewUserWaitingToAccept - adminController} ${error}`,
        500,
      );
    }
  }



  @Get('view-list-report-waiting-to-accept')
  viewListReportWaitingToAccept(
    @Query('pageSize') pageSize: string,
    @Query('page') page: string,
  ) {
    try {
      return this.adminService.viewListReportWaitingToAccept(Number(page), Number(pageSize));
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }




  @Get('view-list-reject-upgrade-to-restaurant')
  viewListRejectToRestaurant( @Query('pageSize') pageSize: string,
  @Query('page') page: string,) {
    try {
      return this.adminService.viewListRejectToRestaurant(Number(page), Number(pageSize));
    } catch (error) {
      throw new HttpException(
        `Lỗi BE {deleteYourPost - getPostFromUser} ${error}`,
        500,
      );
    }
  }




  @Get('view-list-ban-report-post')
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
