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
    const count = await client.stillage.count();
    const stillages: Stillage[] = await client.stillage.findMany({
      take: Number(getCatalogRequestDto.limit) || undefined,
      skip: Number(getCatalogRequestDto.offset) || undefined,
    });
    return { count, stillages };
  }
}
