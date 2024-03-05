import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateAnswerRequestDto,
  CreateAnswerResponseDto,
  UpdateAnswerRequestDto,
  UpdateAnswerResponseDto,
  UpvoteAnswerRequestDto,
} from 'src/dto/answer';
import client from 'src/db/prismaClient';

@Injectable()
export class AnswerService {
  async createAnswer(
    createAnswerRequestDto: CreateAnswerRequestDto,
    userId: string,
  ): Promise<CreateAnswerResponseDto> {
    const forum = await client.forum.findUnique({
      where: { id: createAnswerRequestDto.forumId },
    });

    if (!forum) {
      throw new NotFoundException('Forum id is not found');
    }

    const createdAnswer = await client.answer.create({
      data: {
        body: createAnswerRequestDto.body,
        user: {
          connect: { id: userId },
        },
        forum: {
          connect: { id: createAnswerRequestDto.forumId },
        },
      },
      include: {
        user: true,
        comment: {
          include: {
            user: true,
          },
        },
      },
    });

    return new CreateAnswerResponseDto(createdAnswer);
  }

  async updateAnswer(
    id: string,
    userId: string,
    updateAnswerRequestDto: UpdateAnswerRequestDto,
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

    const updatedAnswer = await client.answer.update({
      where: {
        id,
        userId,
      },
      data: {
        ...updateAnswerRequestDto,
        updated: true,
        last_modified_at: new Date(),
      },
    });

    return new UpdateAnswerResponseDto(updatedAnswer);
  }

  async upvoteAnswer(
    userId: string,
    upvoteAnswerRequestDto: UpvoteAnswerRequestDto,
  ) {
    const answer = await client.answer.findUnique({
      where: { id: upvoteAnswerRequestDto.id },
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

    if (
      upvoteAnswerRequestDto.score !== 1 &&
      upvoteAnswerRequestDto.score !== -1
    ) {
      throw new BadRequestException(
        'Invalid score value. It should be either 1 or -1',
      );
    }

    await client.answer.update({
      where: { id: upvoteAnswerRequestDto.id },
      data: {
        upvotes: {
          increment: upvoteAnswerRequestDto.score,
        },
        votes: {
          push: userId,
        },
      },
    });
  }
}
