import { ApiProperty } from '@nestjs/swagger';
import { Stillage } from '@prisma/client';

export class UpdateStillageRequestDto {
  @ApiProperty()
  name?: string;

  @ApiProperty({
    example:
      'true (boolean), false (boolean) or nothing (this parameter is optional)',
  })
  private_property_status?: boolean;
}

export class FindStillagesRequestDto {
  @ApiProperty()
  name?: string;

  @ApiProperty()
  last_upload_at?: Date[];

  @ApiProperty()
  created_at?: Date[];
}

export class UpdateStillageResponseDto {
  constructor(stillage: Stillage) {
    this.id = stillage.id;
    this.name = stillage.name;
    this.created_at = stillage.created_at;
    this.last_upload_at = stillage.last_upload_at;
    this.private_property_status = stillage.private_property_status;
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
    example: 'private (true(boolean)) / public (false(boolean))',
  })
  private_property_status: boolean;
}
