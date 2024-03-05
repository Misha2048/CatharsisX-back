import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCommentRequestDto,
  CreateCommentResponseDto,
  UpdateCommentRequestDto,
  UpdateCommentResponseDto,
} from 'src/dto/comment';
import client from 'src/db/prismaClient';

@Injectable()
export class CommentService {
  async createComment(
    createCommentRequestDto: CreateCommentRequestDto,
    userId: string,
  ): Promise<CreateCommentResponseDto> {
    const answer = await client.answer.findUnique({
      where: { id: createCommentRequestDto.answerId },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    const createdComment = await client.comment.create({
      data: {
        body: createCommentRequestDto.body,
        user: {
          connect: { id: userId },
        },
        answer: {
          connect: { id: createCommentRequestDto.answerId },
        },
      },
      include: { user: true },
    });

    return new CreateCommentResponseDto(createdComment);
  }

  async updateComment(
    id: string,
    userId: string,
    updateCommentRequestDto: UpdateCommentRequestDto,
  ): Promise<UpdateCommentResponseDto> {
    const existingComment = await client.comment.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingComment) {
      throw new NotFoundException('Comment not found');
    }

    const updatedComment = await client.comment.update({
      where: {
        id,
        userId,
      },
      data: {
        ...updateCommentRequestDto,
        updated: true,
        last_modified_at: new Date(),
      },
    });
    return new UpdateCommentResponseDto(updatedComment);
  }
}
