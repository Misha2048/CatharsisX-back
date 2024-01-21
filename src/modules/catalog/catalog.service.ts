import { Injectable } from '@nestjs/common';
import { Stillage } from '@prisma/client';
import client from 'src/db/prismaClient';
import { GetCatalogRequestDto } from 'src/dto/catalog';

@Injectable()
export class CatalogService {
  async getCatalog(
    getCatalogRequestDto: GetCatalogRequestDto,
    userId: string,
  ): Promise<Stillage[]> {
    return await client.$queryRaw`
      SELECT * FROM "Stillage"
      WHERE "userId" = ${userId}
      ORDER BY "created_at" ASC
      LIMIT ${Number(getCatalogRequestDto.limit)} OFFSET ${Number(
      getCatalogRequestDto.offset,
    )};
    `;
  }
}
