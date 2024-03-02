import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateForumRequestDto,
  FindForumsRequestDto,
  FindForumsDto,
  UpdateForumResponseDto,
  UpdateForumRequestDto,
  FindForumTopicResponseDto,
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
    const blackListKeys = ['limit', 'offset'];
    const filters = await this.commonService.getFilters(
      findForumsRequestDto,
      blackListKeys,
    );
    const forums = await client.forum.findMany({
      where: filters,
      take: Number(findForumsRequestDto.limit) || undefined,
      skip: Number(findForumsRequestDto.offset) || undefined,
      orderBy: {
        created_at: 'desc',
      },
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
    updateForumRequestDto: UpdateForumRequestDto,
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
      data: { ...updateForumRequestDto, last_modified_at: new Date() },
    });
    return new UpdateForumResponseDto(updatedForum);
  }

  async findForumTopic(id: string): Promise<FindForumTopicResponseDto> {
    const forumTopic = await client.forum.findUnique({
      where: { id },
      include: {
        user: true,
        answer: {
          include: {
            user: true,
            comment: {
              include: {
                user: true,
              },
              orderBy: {
                created_at: 'asc',
              },
            },
          },
          orderBy: {
            created_at: 'asc',
          },
        },
      },
    });

    if (!forumTopic) {
      throw new NotFoundException('Forum topic not found');
    }

    return new FindForumTopicResponseDto(forumTopic);
  }
}
