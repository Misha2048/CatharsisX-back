import { ApiProperty } from '@nestjs/swagger';

export class GetCatalogRequestDto {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}
