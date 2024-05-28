import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  ChangeReactPostDTO,
  ReactPostDTO,
  RemoveReactPostDTO,
} from './dto/react.post.dto';

@Injectable()
export class ReactPostService {
  constructor(private prismaService: PrismaService) {}
  async reactPost(data: ReactPostDTO) {
    try {
      var currentTime = new Date();
      if (data.like_state < 0 || data.like_state > 5) data.like_state = 1;
      const isReactPost = await this.prismaService.reactPost.findFirst({
        where: {
          post_id: data.post_id,
          user_id: data.user_id,
          like_state: data.like_state,
        },
      });
      if (isReactPost) {
        throw new ForbiddenException('Ban da like bai viet roi');
      }
      const dataQuery = await this.prismaService.reactPost.create({
        data: {
          post_id: data.post_id,
          user_id: data.user_id,
          like_state: data.like_state,
        },
        include: {
          Post: {
            include: {
              PostImage: true,
            },
          },
          User: {
            select: {
              user_id: true,
              url_avatar: true,
              fullname: true,
            },
          },
        },
      });

      const postOwner = await this.prismaService.post.findUnique({
        where: {
          post_id: Number(data.post_id),
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
            user_id: Number(data.user_id),
          },
        }),
        this.prismaService.post,
      ]);
      const userNotifyCation = notification[0];
      const userContact = notification[1];
      await this.prismaService.notification.create({
        data: {
          user_id: userNotifyCation.user_id,
          title: `1 cảm xúc mới`,
          description: `${userContact.fullname} đã thả 1 cảm xúc vào bài viết của bạn.`,
          date: Date.now().toString(),
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
      const dataQuery = await this.prismaService.reactPost.findFirst({
        where: { post_id: data.post_id, user_id: data.user_id },
      });
      if (dataQuery == null)
        throw new ForbiddenException('Not found data {removeReactPost}');
      const isDelete = await this.prismaService.reactPost.delete({
        where: {
          react_post_id: dataQuery.react_post_id,
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

  async getTotalReact(postId: string) {
    try {
      const listData = await this.prismaService.reactPost.findMany({
        where: {
          post_id: Number(postId),
        },
        include: {
          User: {
            select: {
              fullname: true,
              user_id: true,
              url_avatar: true,
            },
          },
        },
      });
      listData.forEach(
        (e) => (delete e.post_id, delete e.user_id, delete e['react_post_id']),
      );
      return {
        message: 'Create successful',
        statusCode: 200,
        createAt: new Date().toLocaleString('en-US', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false,
        }),
        data: {
          listData,
        },
      };
    } catch (error) {
      return {
        messageError: error,
      };
    }
  }
}
