import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
  UpdateCommentResponseDto,
} from 'src/dto/comment';
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
      data: { ...updateCommentRequestDto, updated: true },
    });
    return new UpdateCommentResponseDto(updatedComment);
  }
}
