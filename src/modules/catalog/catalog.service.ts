import { Injectable } from '@nestjs/common';
import { Stillage } from '@prisma/client';
import client from '../../db/prismaClient';
import { GetCatalogRequestDto } from 'src/dto/catalog';

@Injectable()
export class CatalogService {
  async getCatalog(
    getCatalogRequestDto: GetCatalogRequestDto,
    userId: string,
  ): Promise<{ count: number; stillages: Stillage[] }> {
    const count = await client.stillage.count({ where: { userId } });
    const stillages: Stillage[] = await client.stillage.findMany({
      where: {
        userId: userId,
      },
      take: Number(getCatalogRequestDto.limit) || 10,
      skip: Number(getCatalogRequestDto.offset) || 0,
    });
    return { count, stillages };
  }
}
