import { Injectable, NotFoundException } from '@nestjs/common';
import { FindShelfsRequestDto } from 'src/dto/shelfs';
import client from 'src/db/prismaClient';
import { Shelf } from '@prisma/client';
import { IShelfUpdateError } from '../../interfaces/IShelf';

@Injectable()
export class ShelfsService {
  async findShelfs(
    findShelfsRequestDto: FindShelfsRequestDto,
    userId: string,
  ): Promise<Shelf[]> {
    const filter = Object.entries(findShelfsRequestDto).reduce(
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

    return await client.shelf.findMany({
      where: {
        user: { id: userId },
        ...filter,
      },
    });
  }

  async updateShelfs(
    id: string,
    userId: string,
    opts: any,
  ): Promise<Shelf | IShelfUpdateError> {
    opts.stillageId = opts.stillage;
    delete opts.stillage;

    // Declaring error codes from Prisma
    const errorCodes = {
      P2025: {
        error_status_code: 404,
        error_user_message: 'Shelf or stillage not found',
      },
      P2003: {
        error_status_code: 404,
        error_user_message: 'Stillage not found',
      },
    };

    try {
      return await client.shelf.update({
        where: {
          id,
          userId,
        },
        data: opts,
      });
    } catch (error) {
      const updateError: IShelfUpdateError = errorCodes[error.code];
      return updateError;
    }
  }

  instanceOfUpdateShelfError(object: any): object is IShelfUpdateError {
    return 'error_status_code' in object;
  }

  async deleteShelfs(id: string, userId: string): Promise<Shelf> {
    const shelf = await client.shelf.findUnique({ where: { id } });

    if (!shelf) {
      throw new NotFoundException('Shelf not found');
    }

    await client.file.deleteMany({
      where: {
        shelf_id: id,
      },
    });

    return await client.shelf.delete({
      where: {
        id,
        userId,
      },
    });
  }
}
