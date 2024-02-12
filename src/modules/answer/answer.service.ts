import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateAnswerRequestDto,
  UpdateAnswerResponseDto,
} from 'src/dto/answer';
import client from 'src/db/prismaClient';

@Injectable()
export class AnswerService {
  async createAnswer(
    createAnswerRequestDto: CreateAnswerRequestDto,
    userId: string,
  ) {
    return await client.answer.create({
      data: {
        body: createAnswerRequestDto.body,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async updateAnswer(
    id: string,
    userId: string,
    opts: any,
  ): Promise<UpdateAnswerResponseDto> {
    const existingAnsdwer = await client.answer.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingAnsdwer) {
      throw new NotFoundException('Answer not found');
    }

    opts.updated = true;

    const updatedAnswer = await client.answer.update({
      where: {
        id,
        userId,
      },
      data: opts,
    });

    return new UpdateAnswerResponseDto(updatedAnswer);
  }
}
