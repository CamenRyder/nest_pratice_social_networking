import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AllCommentPostDTO,
  CreateCommentUserDTO,
  DeleteCommentPostDTO,
} from './dto/comment.dto';

@Injectable()
export class CommentService {
  constructor(private prismaService: PrismaService) {}

  async createComment(
    userId: string,
    imgName: string,
    data: CreateCommentUserDTO,
  ) {
    try {
      console.log('Into hereee? on your casse  ? ');
      var currentTime = new Date();
      var noeww = Date.now();

      const commentCreated = await this.prismaService.post.create({
        data: {
          user_id: Number(userId),
          post_type_id: 2,
          post_top_id: Number(data.post_top_id),
          date_create_post: noeww.toString(),
          description: data.description,
        },
      });
      delete commentCreated.date_create_post;
      const postOwner = await this.prismaService.post.findUnique({
        where: {
          post_id: Number(data.post_top_id),
        },
        include: {
          User: {
            select: {
              user_id: true,
            },
          },
        },
      });
      const notification = await Promise.all([
        this.prismaService.user.findUnique({
          where: {
            user_id: postOwner.User.user_id,
          },
        }),
        this.prismaService.user.findUnique({
          where: {
            user_id: Number(userId),
          },
        }),
      ]);
      const userNotifyCation = notification[0];
      const userContact = notification[1];
      await this.prismaService.notification.create({
        data: {
          user_id: userNotifyCation.user_id,
          title: `1 Bình luận mới`,
          description: `${userContact.fullname} đã bình luận vào bài viết của bạn.`,
          date: Date.now().toString(),
        },
      });

      if (imgName != '') {
        const url2 = 'http://camenryder.xyz/public/img/' + imgName;
        const imageCreate = await this.prismaService.postImage.create({
          data: {
            url_image: url2,
            post_id: commentCreated.post_id,
          },
        });

        if (imageCreate == null && commentCreated == null) {
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
            commentCreated,
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
            commentCreated,
          },
        };
      }
    } catch (err) {
      return {
        messageError: err,
      };
    }
  }

  async deleteComment(data: DeleteCommentPostDTO) {
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

  async updateComment(post_id: string, imgName: string, newComment: string) {
    try {
      var currentTime = new Date();
      const dataUpdated = await this.prismaService.post.update({
        where: {
          post_id: Number(post_id),
        },
        data: {
          description: newComment,
        },
      });

      if (imgName != '') {
        const url2 = 'http://camenryder.xyz/public/img/' + imgName;
        const imageDelete = await this.prismaService.postImage.findFirst({
          where: {
            post_id: Number(post_id),
          },
        });
        console.log('Into here :b ');
        console.log(imageDelete);
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
        console.log('create image service successful');

        if (imageCreate == null) {
          throw new ForbiddenException('Check some param {postService}');
        }
        return {
          message: 'Update comment successful',
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
          message: 'Update comment successful',
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

  async getCommentFromPost(CommentFormUserDTO: AllCommentPostDTO) {
    try {
      var currentTime = new Date();

      const offset = (CommentFormUserDTO.page - 1) * 10;
      const data = await this.prismaService.post.findMany({
        take: CommentFormUserDTO.page_size,
        skip: offset,
        orderBy: {
          date_create_post: 'desc',
        },
        where: {
          post_top_id: CommentFormUserDTO.post_id,
          // post_type_id: 2,
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
    } catch (err) {
      return {
        message: err,
      };
    }
  }
}
