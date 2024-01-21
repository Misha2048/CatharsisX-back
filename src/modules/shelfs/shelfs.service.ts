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
            const dateFrom = convertTimestampToDate(new Date(value[0]));
            const dateTo = convertTimestampToDate(new Date(value[1]));
            dateTo.setDate(dateTo.getDate() + 1);

            filters[key] = {
              gte: dateFrom,
              lt: dateTo,
            };
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
      orderBy: {
        created_at: 'asc',
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

  async findShelfsById(id: string, userId: string): Promise<Shelf | undefined> {
    try {
      return await client.shelf.findFirstOrThrow({
        where: {
          id,
          userId,
        },
      });
    } catch (error) {
      return undefined;
    }
  }

  instanceOfUpdateShelfError(object: any): object is IShelfUpdateError {
    return 'error_status_code' in object;
  }

  async deleteShelfs(id: string, userId: string): Promise<Shelf> {
    const shelf = await this.findShelfsById(id, userId);

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

function convertTimestampToDate(timestamp: Date) {
  const formattedDate = timestamp.toISOString().slice(0, 10); // Extract YYYY-MM-DD
  return new Date(formattedDate);
}
