import { ApiProperty } from '@nestjs/swagger';

export class AddUniversityRequestDto {
  @ApiProperty()
  name: string;
}
