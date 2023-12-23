import { ApiProperty } from '@nestjs/swagger';

export class FindShelfsRequestDto {
  @ApiProperty()
  stillage?: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  last_upload_at?: Date;

  @ApiProperty()
  created_at?: Date;
}
