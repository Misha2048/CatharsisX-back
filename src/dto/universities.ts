import { ApiProperty } from '@nestjs/swagger';
import { University } from '@prisma/client';

export class GetUniversitiesResponseDto {
  constructor(university: University) {
    this.id = university.id;
    this.name = university.name;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
