import { Injectable } from '@nestjs/common';
import { FindShelfsRequestDto } from 'src/dto/shelfs';
import client from 'src/db/prismaClient';
import { Shelf } from '@prisma/client';

@Injectable()
export class ShelfsService {
  async findShelfs(
    findShelfsRequestDto: FindShelfsRequestDto,
    userId: string,
  ): Promise<Shelf[]> {
    return await client.shelf.findMany({
      where: {
        user: { id: userId },
        stillage: findShelfsRequestDto.stillage
          ? { id: findShelfsRequestDto.stillage }
          : undefined,
        name: findShelfsRequestDto.name
          ? { contains: findShelfsRequestDto.name }
          : undefined,
        last_upload_at: findShelfsRequestDto.last_upload_at
          ? {
              gte: new Date(findShelfsRequestDto.last_upload_at),
            }
          : undefined,
        created_at: findShelfsRequestDto.created_at
          ? {
              gte: new Date(findShelfsRequestDto.created_at),
            }
          : undefined,
      },
    });
  }
}
