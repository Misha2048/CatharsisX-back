import { Injectable } from '@nestjs/common';
import { Stillage } from '@prisma/client';
import client from '../../db/prismaClient';
import { GetCatalogRequestDto } from 'src/dto/catalog';
import { FindStillagesResponseDto } from 'src/dto/stillages';

@Injectable()
export class CatalogService {
  async getCatalog(
    getCatalogRequestDto: GetCatalogRequestDto,
    userId: string,
  ): Promise<{ count: number; stillages: FindStillagesResponseDto[] }> {
    const count = await client.stillage.count({
      where: { NOT: { userId }, private: false },
    });
    const likedStillagesIDs: string[] = await client.user
      .findUnique({
        select: { liked: true },
        where: { id: userId },
      })
      .then((obj) => obj.liked);
    const stillages: Stillage[] = await client.stillage.findMany({
      where: { NOT: { userId }, private: false },
      take: Number(getCatalogRequestDto.limit) || undefined,
      skip: Number(getCatalogRequestDto.offset) || undefined,
    });
    return {
      count,
      stillages: stillages.map(
        (stillage) =>
          new FindStillagesResponseDto(
            stillage,
            likedStillagesIDs.includes(stillage.id), // set liked
          ),
      ),
    };
  }
}
