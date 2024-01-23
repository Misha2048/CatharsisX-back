import { ApiProperty } from '@nestjs/swagger';
import { FindStillagesResponseDto } from './stillages';
import { Stillage } from '@prisma/client';

export class GetCatalogRequestDto {
  @ApiProperty()
  limit: number;

  @ApiProperty({ description: 'zero-based offset index' })
  offset: number;
}

export class GetCatalogResponseDto {
  @ApiProperty({ default: 100 })
  count: number;

  @ApiProperty({ isArray: true, type: FindStillagesResponseDto })
  stillages: Stillage[];
}
