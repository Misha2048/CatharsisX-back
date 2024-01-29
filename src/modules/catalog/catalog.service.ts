import { Injectable } from '@nestjs/common';
import { Stillage } from '@prisma/client';
import client from '../../db/prismaClient';
import { GetCatalogRequestDto } from 'src/dto/catalog';
import { FindStillagesResponseDto } from 'src/dto/stillages';
import { CommonService } from '../common/common.service';

@Injectable()
export class CatalogService {
  constructor(private readonly commonService: CommonService) {}
  async getCatalog(
    getCatalogRequestDto: GetCatalogRequestDto,
    userId: string,
  ): Promise<{ count: number; stillages: FindStillagesResponseDto[] }> {
    const blackListKeys = ['limit', 'offset'];
    const filter = await this.commonService.getFilters(
      getCatalogRequestDto,
      blackListKeys,
    );
    const count = await client.stillage.count({
      where: { ...filter, NOT: { userId }, private: false },
    });
    const likedStillagesIDs: string[] = await client.user
      .findUnique({
        select: { liked: true },
        where: { id: userId },
      })
      .then((obj) => obj.liked);
    const stillages: Stillage[] = await client.stillage.findMany({
      where: { ...filter, NOT: { userId }, private: false },
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
