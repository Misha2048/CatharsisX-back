import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAnswerRequestDto,
  UpdateAnswerResponseDto,
  UpvoteAnswerRequestDto,
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
    const existingAnswer = await client.answer.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingAnswer) {
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

  async upvoteAnswer(userId: string, opts) {
    const answer = await client.answer.findUnique({
      where: { id: opts.id },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found');
    }

    if (answer.userId === userId) {
      throw new BadRequestException('Users cannot vote for their own answers');
    }

    const user = await client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (answer.votes.includes(userId)) {
      throw new BadRequestException('User already voted');
    }

    if (opts.score !== 1 && opts.score !== -1) {
      throw new BadRequestException(
        'Invalid score value. It should be either 1 or -1',
      );
    }

    const incrementValue = opts.score === 1 ? 1 : -1;

    await client.answer.update({
      where: { id: opts.id },
      data: {
        upvotes: {
          increment: incrementValue,
        },
        votes: {
          push: userId,
        },
      },
    });
  }
}
