import { ApiProperty } from '@nestjs/swagger';
import { FindStillagesResponseDto } from './stillages';
import { Stillage } from '@prisma/client';

export class GetCatalogRequestDto {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class GetCatalogResponseDto {
  @ApiProperty()
  count: number;

  @ApiProperty({ isArray: true, type: FindStillagesResponseDto })
  stillages: Stillage[];
}
