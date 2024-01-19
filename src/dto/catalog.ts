import { ApiProperty } from '@nestjs/swagger';
import { Stillage } from '@prisma/client';

export class GetCatalogRequestDto {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class GetCatalogResponseDto {
  constructor(stillage: Stillage) {
    this.id = stillage.id;
    this.userId = stillage.userId;
    this.name = stillage.name;
    this.created_at = stillage.created_at;
    this.last_upload_at = stillage.last_upload_at;
    this.universityId = stillage.university_id;
    this.private = stillage.private;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;
  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  last_upload_at: Date;

  @ApiProperty()
  universityId: string;

  @ApiProperty({
    example: 'true (boolean)(private) / false (boolean)(public)',
  })
  private: boolean;
}
