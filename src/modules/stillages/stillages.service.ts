import { Injectable, NotFoundException } from '@nestjs/common';
import client from '../../db/prismaClient';
import { Stillage } from '@prisma/client';
import { FindStillagesRequestDto } from 'src/dto/stillages';

@Injectable()
export class StillagesService {
  async findStillages(
    findStillagesRequestDto: FindStillagesRequestDto,
    userId: string,
  ): Promise<Stillage[]> {
    const filter = Object.entries(findStillagesRequestDto).reduce(
      (filters, [key, value]) => {
        if (value !== undefined && value !== '') {
          filters[key] =
            typeof value === 'string'
              ? { contains: value }
              : { gte: new Date(value) };
        }
        return filters;
      },
      {},
    );

    return await client.stillage.findMany({
      where: {
        user: { id: userId },
        ...filter,
      },
    });
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
    userId: string,
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
    const stillage = await client.stillage.findUnique({ where: { id } });

    if (!stillage) {
      throw new NotFoundException('Stillage not found');
    }

    await client.file.deleteMany({
      where: {
        shelf_id: id,
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
}
