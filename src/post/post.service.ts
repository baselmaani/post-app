import { Injectable } from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateParam {
  title: string;
  content: string;
  images: string;
}

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
  async createPost({ title, content, images }: CreateParam, userId: number) {
    console.log({ userId });
    return this.prisma.post.create({
      data: {
        title,
        content,
        images,
        userId: userId,
      },
    });
  }

  async getAll() {
    return this.prisma.post.findMany();
  }

  async update(postId: number, data: CreateParam, userId: number) {
    const userIdByPost = await this.prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        user_id: {
          select: {
            id: true,
          },
        },
      },
    });
    //console.log(userIdByPost);
    if (!userIdByPost) throw new NotFoundError('there not user!!');
    if (userIdByPost.user_id.id !== userId)
      throw new NotFoundError('u not allow to do that');
    return this.prisma.post.update({ where: { id: postId }, data });
  }

  async delete(postId: number, userId: number) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundError('there is no post');
    if (post.userId !== userId)
      throw new NotFoundError('u cant delete this post');
    return this.prisma.post.delete({
      where: { id: postId },
    });
  }

  async getPostByUserId(id: number) {
    const posts = await this.prisma.post.findMany({
      where: { userId: id },
    });
    return posts;
  }
}
