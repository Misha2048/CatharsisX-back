import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateForumRequestDto,
  FindForumsRequestDto,
  FindForumsDto,
  UpdateForumResponseDto,
} from 'src/dto/forum';
import client from 'src/db/prismaClient';
import { CommonService } from '../common/common.service';

@Injectable()
export class ForumService {
  constructor(private readonly commonService: CommonService) {}
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

  async findForums(
    findForumsRequestDto: FindForumsRequestDto,
  ): Promise<{ count: number; forums: FindForumsDto[] }> {
    const blackListKeys = ['limit'];
    const limit = Number(findForumsRequestDto.limit);

    if (limit < 0 || isNaN(limit)) {
      throw new BadRequestException('Limit must be a non-negative number');
    }

    const filters = await this.commonService.getFilters(
      findForumsRequestDto,
      blackListKeys,
    );
    const forums = await client.forum.findMany({
      where: filters,
      take: Number(findForumsRequestDto.limit) || undefined,
    });
    const count = await client.forum.count({
      where: filters,
    });

    return {
      count: count,
      forums: forums.map((forum) => new FindForumsDto(forum)),
    };
  }

  async updateForum(
    id: string,
    userId: string,
    opts: any,
  ): Promise<UpdateForumResponseDto> {
    const existingForum = await client.forum.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!existingForum) {
      throw new NotFoundException('Forum not found');
    }

    const updatedForum = await client.forum.update({
      where: {
        id,
        userId,
      },
      data: opts,
    });
    return new UpdateForumResponseDto(updatedForum);
  }
}
