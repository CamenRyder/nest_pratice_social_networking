import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePostUserDTOabc,
  DeletePostUserDTO,
  PostFromUserDTO,
  ReportPostDTO,
} from './dto/post.dto';
import { log } from 'console';
const fs = require('fs');

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async createPostMultiple(
    userId: string,
    filenames: any,
    description: CreatePostUserDTOabc,
  ) {
    try {
      var currentTime = new Date();
      var noeww = Date.now();
      //   await this.deleteImageFormPostImage();
      const postCreated = await this.prismaService.post.create({
        data: {
          user_id: Number(userId),
          post_type_id: 1,
          date_create_post: noeww.toString(),
          description: description.description,
        },
      });

      delete postCreated.date_create_post;
      if (filenames != null) {
        filenames.forEach(async (imgName: { filename: string }) => {
          const url2 = 'http://camenryder.xyz/public/img/' + imgName.filename;
          const imageCreate = await this.prismaService.postImage.create({
            data: {
              url_image: url2,
              post_id: postCreated.post_id,
            },
          });
        });
        const imagess = await this.prismaService.postImage.findMany({
          where: {
            post_id: postCreated.post_id,
          },
        });
        return {
          message: 'Create successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            postCreated,
            imagess,
          },
        };
      } else {
        return {
          message: 'Create successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            postCreated,
          },
        };
      }
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async updatePostMultiple(
    post_id: string,
    filenames: any,
    description: CreatePostUserDTOabc,
  ) {
    try {
      var currentTime = new Date();
      var noeww = Date.now();
      //   await this.deleteImageFormPostImage();
      const postData = await this.prismaService.post.update({
        where: {
          post_id: Number(post_id),
        },
        data: {
          description: description.description,
        },
      });

      if (filenames[0] != null) {
        await this.prismaService.postImage.deleteMany({
          where: {
            post_id: Number(post_id),
          },
        });
        filenames.forEach(async (imgName: { filename: string }) => {
          const url2 = 'http://camenryder.xyz/public/img/' + imgName.filename;
          const imageCreate = await this.prismaService.postImage.create({
            data: {
              url_image: url2,
              post_id: Number(post_id),
            },
          });
        });
        const imagess = await this.prismaService.postImage.findMany({
          where: {
            post_id: Number(post_id),
          },
        });
        // const newArray = post.Images ;
        // chooseFile => 2 => createImgae => { object } => newArray = [... object  ,...newArray ]
        // const newArrayState , setnewArrayState ,
        // 2  +  2
        // xóa 2 tấm thêm moiws 2 tấm
        // submit

        // xóa 2 tấm thêm moiws 2 tấm
        return {
          message: 'Update post successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            imagess,
            postData,
          },
        };
      } else {
        return {
          message: 'Update post successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            postData,
          },
        };
      }
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async deletePost(data: DeletePostUserDTO) {
    try {
      const deleteNoti = await this.prismaService.notification.deleteMany({
        where: {
          post_id: Number(data.post_id),
        },
      });

      if (deleteNoti) {
       
        const totalReported = await this.prismaService.report.findMany({
          where: {
            post_id: data.post_id,
          },
        });
  
        totalReported.forEach(async (element) => {
            await this.prismaService.report.delete({
              where: {
               report_id: element['report_id'] 
              }
            })
        });

        const isDelete = await this.prismaService.post.delete({
          where: {
            post_id: Number(data.post_id),
            user_id: Number(data.user_id),
          },
        });

        if (isDelete) {
          return {
            message: 'Delete successful',
            statusCode: 200,
            createAt: new Date().toLocaleString('en-US', {
              timeZone: 'Asia/Ho_Chi_Minh',
              hour12: false,
            }),
            data: {
              isDelete,
            },
          };
        }
      } else {
        throw new ForbiddenException('Bạn ko đc quyền xóa post');
      }
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  // method
  async deleteImageFormPostImage() {
    const data = await this.prismaService.postImage.findMany({
      where: {
        post_id: null,
      },
    });
    const substringToRemove = 'http://camenryder.xyz/';
    data.forEach((e) => {
      const filePath = e.url_image.replace(substringToRemove, '');
      fs.unlink(filePath, (err: any) => {
        console.log('Something went wrong {deleteImageFormPostImage}');
      });
    });
    await this.prismaService.postImage.deleteMany({
      where: {
        post_id: null,
      },
    });
  }

  async getPostFromUser(PostFormUserDTO: PostFromUserDTO) {
    try {
      var currentTime = new Date();
      const offset = (PostFormUserDTO.page - 1) * 10;
      const data = await this.prismaService.post.findMany({
        take: PostFormUserDTO.page_size,
        skip: offset,
        orderBy: {
          date_create_post: 'desc',
        },
        where: {
          user_id: PostFormUserDTO.user_id,
          post_type_id: 1,
        },
        include: {
          User: {
            select: {
              fullname: true,
              url_avatar: true,
              user_id: true,
            },
          },
          PostImage: true,
        },
      });
      const commentPromises = data.map(async (element) => {
        const totalComments = await this.prismaService.post.count({
          where: {
            post_top_id: element.post_id,
          },
        });
        const totalReact = await this.prismaService.reactPost.count({
          where: {
            post_id: element.post_id,
          },
        });
        element['Total comment'] = totalComments;
        element['Total react'] = totalReact;
        return element;
      });

      const dataWithComments = await Promise.all(commentPromises);

      return {
        message: 'Update successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: dataWithComments,
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async reportPost(data: ReportPostDTO) {
    try {
      var currentTime = new Date();
      var noeww = Date.now();
      const totalReported = await this.prismaService.report.findMany({
        where: {
          user_id: data.user_id,
          post_id: data.post_id,
        },
      });

      totalReported.forEach(async (element) => {
          await this.prismaService.report.delete({
            where: {
             report_id: element['report_id'] 
            }
          })
      });
     data.issue_id.forEach( async (element) => {
        await this.prismaService.report.create({
          data: {
            user_id: data.user_id,
            post_id: data.post_id,
            issue_id: element ,  
            dateReported: noeww.toString(),
          },
        });
      })
      
      return {
        message: 'Report successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
             };
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async getPostAllUser(page: number, pageSize: number) {
    try {
      var currentTime = new Date();
      const offset = (page - 1) * pageSize;
      const data = await this.prismaService.post.findMany({
        take: pageSize,
        skip: offset,
        orderBy: {
          date_create_post: 'desc',
        },
        where: {
          post_type_id: 1,
        },
        include: {
          User: true,
          PostImage: true,
        },
      });
      const commentPromises = data.map(async (element) => {
        const totalComments = await this.prismaService.post.count({
          where: {
            post_top_id: element.post_id,
          },
        });
        const totalReact = await this.prismaService.reactPost.count({
          where: {
            post_id: element.post_id,
          },
        });
        element['Total comment'] = totalComments;
        element['Total react'] = totalReact;
        return element;
      });

      const dataW = await Promise.all(commentPromises);

      const dataCount = await Promise.all([
        this.prismaService.post.count({
          where: {
            post_type_id: 1,
          },
        }),
        this.prismaService.post.count({
          where: {
            post_type_id: 3,
          },
        }),
      ]);
      const total = dataCount[0] + dataCount[1];
      return {
        message: 'Update successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: dataW,
        total: total,
      };
    } catch (error) {
      return {
        messageError: error,
      };
    }
  }
}
