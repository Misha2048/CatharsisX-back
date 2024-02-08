import { Injectable } from '@nestjs/common';
import {
  CreateForumRequestDto,
  FindForumsRequestDto,
  FindForumsDto,
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
}
