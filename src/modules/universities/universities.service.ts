import { Injectable } from '@nestjs/common';
import client from '../../db/prismaClient';

@Injectable()
export class UniversitiesService {
  async findUniversities(): Promise<string[]> {
    const universities = await client.university.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    const universitiesListStr = universities.map(function (university) {
      return university['name'];
    });

    return universitiesListStr;
  }
}
