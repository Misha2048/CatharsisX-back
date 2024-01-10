import { Injectable, NotFoundException } from '@nestjs/common';
import client from '../../db/prismaClient';
import { LikedStillage, Stillage } from '@prisma/client';
import {
  FindStillagesRequestDto,
  GetLikedStillagesRequestDTO,
} from 'src/dto/stillages';

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

  async toggleLikeStillage(
    stillageId: string,
    userId: string,
  ): Promise<LikedStillage> {
    const stillage = await client.stillage.findUnique({
      where: { id: stillageId },
    });
    if (!stillage) {
      throw new NotFoundException(`Stillage with not found`);
    }

    const likedStillage = await client.likedStillage.findFirst({
      where: {
        stillageId: stillageId,
        userId: userId,
      },
    });

    if (likedStillage) {
      return await client.likedStillage.delete({
        where: { id: likedStillage.id },
      });
    } else {
      return await client.likedStillage.create({
        data: {
          user: { connect: { id: userId } },
          stillage: { connect: { id: stillageId } },
        },
      });
    }
  }

  async getLikedStillages(
    getLikedStillagesRequestDTO: GetLikedStillagesRequestDTO,
    userId: string,
  ): Promise<LikedStillage[]> {
    return await client.$queryRaw`
      SELECT * FROM "LikedStillage"
      WHERE "userId" = ${userId}
      LIMIT ${Number(getLikedStillagesRequestDTO.limit)} OFFSET ${Number(
      getLikedStillagesRequestDTO.offset,
    )};
    `;
  }
}
