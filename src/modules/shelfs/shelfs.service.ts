import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateShelfRequestDto,
  FindShelfsRequestDto,
  FindShelfsResponseDto,
} from 'src/dto/shelfs';
import client from 'src/db/prismaClient';
import { Shelf } from '@prisma/client';
import { IShelfUpdateError } from '../../interfaces/IShelf';

@Injectable()
export class ShelfsService {
  async findShelfs(
    findShelfsRequestDto: FindShelfsRequestDto,
    userId?: string,
  ): Promise<Shelf[]> {
    const filter = Object.entries(findShelfsRequestDto).reduce(
      (filters, [key, value]) => {
        if (value !== undefined && value !== '') {
          if (key === 'stillage') {
            filters[key] = { id: value };
          } else if (key === 'last_upload_at' || key === 'created_at') {
            const dateFrom = new Date(value[0]);
            dateFrom.setHours(0, 0, 0, 0);
            const dateTo = new Date(value[1]);
            dateTo.setDate(dateTo.getDate() + 1);
            dateTo.setHours(0, 0, 0, 0);
            filters[key] = {
              gte: dateFrom,
              lt: dateTo,
            };
          } else if (key === 'name') {
            filters[key] = { contains: value, mode: 'insensitive' };
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
        userId,
        ...filter,
      },
      orderBy: {
        name: 'asc',
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

  async createShelf(
    createShelfDto: CreateShelfRequestDto,
    userId: string,
  ): Promise<FindShelfsResponseDto> {
    try {
      return await client.shelf.create({
        data: {
          userId,
          stillageId: createShelfDto.stillage,
          name: createShelfDto.name,
        },
      });
    } catch (error) {
      if (error.code == 'P2002') {
        throw new BadRequestException(
          'A shelf with the same name already exists. Specify another name.',
        );
      } else if (error.code == 'P2003') {
        throw new NotFoundException('User or stillage not found');
      } else throw new BadRequestException('Failed to create a new shelf');
    }
  }
}
