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
          if (key === 'stillage') {
            filters[key] = { id: value };
          } else if (key === 'last_upload_at' || key === 'created_at') {
            const dates = value.split(',');
            filters[key] = { gte: new Date(dates[0]), lte: new Date(dates[1]) };
          } else {
            filters[key] = { contains: value };
          }
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

  async updatePropertyStatus(
    id: string,
    userId: string,
  ): Promise<Stillage | undefined | null> {
    const stillage = await this.findStillageById(id, userId);

    if (!stillage) {
      throw new NotFoundException('Stillage not found');
    }

    stillage.property_status =
      stillage.property_status === 'private' ? 'public' : 'private';

    return await client.stillage.update({
      where: {
        id,
        userId,
      },
      data: stillage,
    });
  }
}
