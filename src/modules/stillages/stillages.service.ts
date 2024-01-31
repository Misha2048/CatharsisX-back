import { Injectable, NotFoundException } from '@nestjs/common';
import client from '../../db/prismaClient';
import { Stillage } from '@prisma/client';
import {
  FindStillagesRequestDto,
  GetLikedStillagesRequestDTO,
  FindStillagesResponseDto,
} from 'src/dto/stillages';
import { CommonService } from '../common/common.service';

@Injectable()
export class StillagesService {
  constructor(private readonly commonService: CommonService) {}
  async findStillages(
    findStillagesRequestDto: FindStillagesRequestDto,
    userId: string,
  ): Promise<FindStillagesResponseDto[]> {
    const filter = await this.commonService.getFilters(findStillagesRequestDto);

    const likedStillageIDs: string[] = await client.user
      .findUnique({
        select: { liked: true },
        where: { id: userId },
      })
      .then((obj) => obj.liked);

    const likedStillages: Stillage[] = await client.stillage.findMany({
      where: {
        id: { in: likedStillageIDs },
        ...filter,
      },
      orderBy: { name: 'asc' },
    });

    const notLikedStillages: Stillage[] = await client.stillage.findMany({
      where: {
        id: { notIn: likedStillageIDs },
        user: { id: userId },
        ...filter,
      },
      orderBy: { name: 'asc' },
    });

    return [
      ...likedStillages.map(
        (stillage) => new FindStillagesResponseDto(stillage, true),
      ),
      ...notLikedStillages.map(
        (stillage) => new FindStillagesResponseDto(stillage, false),
      ),
    ];
  }

  async updateStillage(
    id: string,
    userId: string,
    opts: any,
  ): Promise<Stillage | null | undefined> {
    try {
      return await client.stillage.update({
        where: {
          id,
          userId,
        },
        data: opts,
      });
    } catch (error) {
      return undefined;
    }
  }

  async findStillageById(
    id: string,
    userId?: string,
  ): Promise<Stillage | undefined> {
    try {
      return await client.stillage.findFirstOrThrow({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      return undefined;
    }
  }

  async deleteStillage(id: string, userId: string): Promise<Stillage> {
    const stillage = await this.findStillageById(id, userId);

    if (!stillage) {
      throw new NotFoundException('Stillage not found');
    }

    await client.file.deleteMany({
      where: {
        stillage_Id: id,
      },
    });

    await client.shelf.deleteMany({
      where: {
        stillageId: id,
        userId,
      },
    });

    return await client.stillage.delete({
      where: {
        id,
        userId,
      },
    });
  }

  async toggleLikeStillage(stillageId: string, userId: string): Promise<void> {
    const user = await client.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const stillage = await client.stillage.findUnique({
      where: { id: stillageId },
    });
    if (!stillage) {
      throw new NotFoundException(`Stillage not found`);
    }

    if (user.liked.includes(stillageId)) {
      user.liked = user.liked.filter((id) => id !== stillageId);
    } else {
      user.liked.push(stillageId);
    }

    await client.user.update({
      where: { id: userId },
      data: { liked: user.liked },
    });
  }

  async getLikedStillages(
    getLikedStillagesRequestDTO: GetLikedStillagesRequestDTO,
    userId: string,
  ): Promise<{ count: number; likedStillages: Stillage[] }> {
    const user = await client.user.findUnique({
      where: { id: userId },
      select: { liked: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const count = user.liked.length;
    const blackListKeys = ['limit', 'offset'];
    const filter = await this.commonService.getFilters(
      getLikedStillagesRequestDTO,
      blackListKeys,
    );
    let likedStillages = await client.stillage.findMany({
      where: {
        id: {
          in: user.liked || [],
        },
        ...filter,
      },
      orderBy: {
        name: 'asc',
      },
      take: Number(getLikedStillagesRequestDTO.limit) || undefined,
      skip: Number(getLikedStillagesRequestDTO.offset) || undefined,
    });

    likedStillages = likedStillages.map((stillage) => ({
      ...stillage,
      liked: true,
    }));

    return { count, likedStillages };
  }
}
