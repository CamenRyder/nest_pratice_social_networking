import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangeReactPostDTO,
  DeletePostUserDTO,
  PostFromUserDTO,
  ReactPostDTO,
  RemoveReactPostDTO,
  ReportPostDTO,
} from './dto/post.dto';
import { skip, take } from 'rxjs';
const fs = require('fs');

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}
  async createPost(userId: string, imgName: string, description: string) {
    try {
      var currentTime = new Date();
      var noeww = Date.now();
      //   await this.deleteImageFormPostImage();
      const postCreated = await this.prismaService.post.create({
        data: {
          user_id: Number(userId),
          post_type_id: 1,
          date_create_post: noeww.toString(),
          description: description,
        },
      });
      delete postCreated.date_create_post;
      if (imgName != '') {
        const url2 = 'http://camenryder.xyz/public/img/' + imgName;
        const imageCreate = await this.prismaService.postImage.create({
          data: {
            url_image: url2,
            post_id: postCreated.post_id,
          },
        });

        if (imageCreate == null && postCreated == null) {
          throw new ForbiddenException('Check some param {postService}');
        }
        return {
          message: 'Create successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            postCreated,
            imageCreate,
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

  async deletePost(data: DeletePostUserDTO) {
    try {
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
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async updatePost(post_id: string, imgName: string, newDescription: string) {
    try {
      var currentTime = new Date();
      const dataUpdated = await this.prismaService.post.update({
        where: {
          post_id: Number(post_id),
        },
        data: {
          description: newDescription,
        },
      });

      if (imgName != '') {
        const url2 = 'http://camenryder.xyz/public/img/' + imgName;
        const imageDelete = await this.prismaService.postImage.findFirst({
          where: {
            post_id: Number(post_id),
          },
        });
        await this.prismaService.postImage.delete({
          where: {
            post_image_id: imageDelete.post_image_id,
          },
        });
        const imageCreate = await this.prismaService.postImage.create({
          data: {
            url_image: url2,
            post_id: Number(post_id),
          },
        });

        if (imageCreate == null) {
          throw new ForbiddenException('Check some param {postService}');
        }
        return {
          message: 'Update successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            dataUpdated,
            imageCreate,
          },
        };
      } else {
        return {
          message: 'Update successful',
          statusCode: 200,
          createAt: currentTime.toLocaleString('en-US', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
          }),
          data: {
            dataUpdated,
          },
        };
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
      console.log(PostFormUserDTO);
      const offset = (PostFormUserDTO.page - 1) * 10;
      const data = await this.prismaService.post.findMany({
        take: PostFormUserDTO.page_size,
        skip: offset,
        orderBy: {
          date_create_post: 'desc',
        },
        where: {
          user_id: PostFormUserDTO.user_id,
        },
        include: {
          User: true,
          PostImage: true,
        },
      });
      data.forEach((element) => {
        element.date_create_post = new Date(
          Number(element.date_create_post),
        ).toUTCString();
      });
      return {
        message: 'Update successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          data,
        },
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async reactPost(data: ReactPostDTO) {
    try {
      var currentTime = new Date();
      if (data.like_state < 0 || data.like_state > 5) data.like_state = 1;
      const dataQuery = await this.prismaService.reactPost.create({
        data: {
          post_id: data.post_id,
          user_id: data.user_id,
          like_state: data.like_state,
        },
        include: {
          Post: true,
          User: true,
        },
      });
      return {
        message: 'React post successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          dataQuery,
        },
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }

  async removeReactPost(data: RemoveReactPostDTO) {
    try {
      var currentTime = new Date();
      const dataQuery = this.prismaService.reactPost.findFirst({
        where: { post_id: data.post_id, user_id: data.user_id },
      });
      if (dataQuery == null)
        throw new ForbiddenException('Not found data {removeReactPost}');
      const isDelete = this.prismaService.reactPost.delete({
        where: {
          react_post_id: (await dataQuery).react_post_id,
        },
      });
      return {
        message: 'Delete react post successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          isDelete,
        },
      };
    } catch (err) {
      return {
        message: err,
      };
    }
  }
  async changeReactPost(data: ChangeReactPostDTO) {
    try {
      var currentTime = new Date();
      if (data.like_state < 1 || data.like_state > 5) data.like_state = 1;
      const dataQuery = await this.prismaService.reactPost.findFirst({
        where: {
          post_id: data.post_id,
          user_id: data.user_id,
        },
      });
      if (!dataQuery)
        throw new ForbiddenException(
          'data not found, check your body request {changeReactPost}',
        );
      const dataUpdate = await this.prismaService.reactPost.update({
        where: {
          react_post_id: dataQuery.react_post_id,
        },
        data: dataQuery,
        include: {
          Post: true,
          User: true,
        },
      });
      return {
        message: 'React post successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          dataUpdate,
        },
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
      if (totalReported.length > 4)
        throw new ForbiddenException('Your limit 5 report!');
      const isReported = await this.prismaService.report.findFirst({
        where: {
          user_id: data.user_id,
          post_id: data.post_id,
          issue_id: data.issue_id,
        },
      });
      if (isReported) throw new ForbiddenException('User reported this issue!');
      const dataQuery = await this.prismaService.report.create({
        data: {
          user_id: data.user_id,
          post_id: data.post_id,
          issue_id: data.issue_id,
          dateReported: noeww.toString(),
        },
      });
      return {
        message: 'Report successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          dataQuery,
        },
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
      const offset = (page - 1) * 10;
      const data = await this.prismaService.post.findMany({
        take: pageSize,
        skip: offset,
        orderBy: {
          date_create_post: 'desc',
        },
        include: {
          User: true,
          PostImage: true,
        },
      });
      data.forEach((element) => {
        element.date_create_post = new Date(
          Number(element.date_create_post),
        ).toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        });
      });
      return {
        message: 'Update successful',
        statusCode: 200,
        createAt: currentTime.toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          data,
        },
      };
    } catch (error) {
      return {
        messageError: error,
      };
    }
  }
}
