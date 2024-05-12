import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeletePostUserDTO } from './dto/post.dto';
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
          createAt: currentTime.toUTCString(),
          data: {
            postCreated,
            imageCreate,
          },
        };
      } else {
        return {
          message: 'Create successful',
          statusCode: 200,
          createAt: currentTime.toUTCString(),
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
          createAt: new Date().toUTCString(),
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
          createAt: currentTime.toUTCString(),
          data: {
            dataUpdated,
            imageCreate,
          },
        };
      } else {
        return {
          message: 'Update successful',
          statusCode: 200,
          createAt: currentTime.toUTCString(),
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
}
