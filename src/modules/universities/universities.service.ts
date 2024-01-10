import { Injectable } from '@nestjs/common';
import client from '../../db/prismaClient';
import { University } from '@prisma/client';

@Injectable()
export class UniversitiesService {
  async findUniversities(): Promise<University[]> {
    return await client.university.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }
}
