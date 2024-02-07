import { Injectable } from '@nestjs/common';
import { CreateForumRequestDto } from 'src/dto/forum';
import client from 'src/db/prismaClient';

@Injectable()
export class ForumService {
  async createForum(
    createForumRequestDto: CreateForumRequestDto,
    userId: string,
  ) {
    return await client.forum.create({
      data: {
        ...createForumRequestDto,
        user: {
          connect: { id: userId },
        },
      },
    });
  }
}
