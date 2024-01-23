import { Injectable, NotFoundException } from '@nestjs/common';
import client from '../../db/prismaClient';
import { Stillage } from '@prisma/client';
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
            const dateFrom = new Date(value[0]).setHours(0, 0, 0, 0);
            const dateTo = new Date(value[1]);
            dateTo.setDate(dateTo.getDate() + 1);
            dateTo.setHours(0, 0, 0, 0);

            filters[key] = { gte: dateFrom, lt: dateTo };
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

    const stillage = await this.findStillageById(stillageId, userId);
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
  ): Promise<Stillage[]> {
    const user = await client.user.findUnique({
      where: { id: userId },
      select: { liked: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await client.$queryRaw`
      SELECT * FROM "Stillage"
      WHERE "id" = ANY (${user.liked || []})
      LIMIT ${Number(getLikedStillagesRequestDTO.limit)} OFFSET ${Number(
      getLikedStillagesRequestDTO.offset,
    )};
    `;
  }
}
