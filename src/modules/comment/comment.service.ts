import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentRequestDto } from 'src/dto/comment';
import client from 'src/db/prismaClient';

@Injectable()
export class CommentService {
  async createComment(
    createCommentRequestDto: CreateCommentRequestDto,
    userId: string,
  ) {
    const answer = await client.answer.findUnique({
      where: { id: createCommentRequestDto.answerId },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    return await client.comment.create({
      data: {
        body: createCommentRequestDto.body,
        user: {
          connect: { id: userId },
        },
        answer: {
          connect: { id: createCommentRequestDto.answerId },
        },
      },
    });
  }
}
