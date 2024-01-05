import { Injectable } from '@nestjs/common';
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
          filters[key] =
            key === 'stillage'
              ? { id: value }
              : typeof value === 'string'
              ? { contains: value }
              : { gte: new Date(value) };
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

    try {
      return await client.shelf.update({
        where: {
          id,
          userId,
        },
        data: opts,
      });
    } catch (error) {
      const errorCodes = {
        P2025: {
          error_message: error,
          error_status_code: 404,
          error_user_message: 'Shelf or stillage not found',
        },
        P2003: {
          error_message: error,
          error_status_code: 404,
          error_user_message: 'Stillage not found',
        },
      };

      const updateError: IShelfUpdateError = errorCodes[error.code];

      return updateError;
    }
  }

  instanceOfUpdateShelfError(object: any): object is IShelfUpdateError {
    return 'error_message' in object;
  }
}
