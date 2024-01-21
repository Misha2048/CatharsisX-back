import { Injectable } from '@nestjs/common';
import { Stillage } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { randomInt } from 'crypto';
import { GetCatalogRequestDto } from 'src/dto/catalog';

const prisma = new PrismaClient();

@Injectable()
export class CatalogService {
  async getCatalog(
    getCatalogRequestDto: GetCatalogRequestDto,
    userId: string,
  ): Promise<{ count: number; stillages: Stillage[] }> {
    const count = await prisma.stillage.count({ where: { userId } });
    const stillages: Stillage[] = await prisma.stillage.findMany({
      where: {
        userId: userId,
      },
      take: Number(getCatalogRequestDto.limit) || 10,
      skip: Number(getCatalogRequestDto.offset) || 0,
    });
    return { count, stillages };
  }
}
