import { ApiProperty } from '@nestjs/swagger';
import { Stillage } from '@prisma/client';

export class UpdateStillageRequestDto {
  @ApiProperty({
    example:
      "'firstStillage' or 'secondStillage' or 'thirdStillage' or 'Test_stillage' or 'test stillage' etc. (string) (optional parameter)",
  })
  name?: string;

  @ApiProperty({
    example:
      'true (boolean)(private), false (boolean)(public) or nothing (this parameter is optional)',
  })
  private?: boolean;
}

export class FindStillagesRequestDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  last_upload_at?: Date[];

  @ApiProperty()
  created_at?: Date[];
}

export class GetLikedStillagesRequestDTO {
  @ApiProperty()
  limit: number;

  @ApiProperty()
  offset: number;
}

export class UpdateStillageResponseDto {
  constructor(stillage: Stillage) {
    this.id = stillage.id;
    this.name = stillage.name;
    this.created_at = stillage.created_at;
    this.last_upload_at = stillage.last_upload_at;
    this.private = stillage.private;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  last_upload_at: Date;

  @ApiProperty({
    example: 'true (boolean)(private) / false (boolean)(public)',
  })
  private: boolean;
}
