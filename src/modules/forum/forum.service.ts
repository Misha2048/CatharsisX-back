import { Injectable } from '@nestjs/common';
import {
  CreateForumRequestDto,
  FindForumsRequestDto,
  FindForumsResponseDto,
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
  ): Promise<FindForumsResponseDto[]> {
    const filters = await this.commonService.getFilters(findForumsRequestDto);
    const forums = await client.forum.findMany({
      where: filters,
    });

    return forums.map((forum) => new FindForumsResponseDto(forum));
  }
}
