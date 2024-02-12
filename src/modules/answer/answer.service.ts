import { Injectable } from '@nestjs/common';
import { CreateAnswerRequestDto } from 'src/dto/answer';
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
}
