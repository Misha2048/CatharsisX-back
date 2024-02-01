import { ApiProperty } from '@nestjs/swagger';
import { Shelf } from '@prisma/client';

export class FindShelfsRequestDto {
  @ApiProperty({
    description: 'Stillage id (string) of the shelves we want to get',
    example: "'1', '2', '3', '12'...",
  })
  stillage: string;

  @ApiProperty({
    required: false,
    description: "Shelf's name",
    example: "'Shelf - 1', 'shelf_2', 'Shelf for the Math'",
  })
  name?: string;

  @ApiProperty({
    required: false,
    description: 'Last upload date for the filters',
    example: "'2024-02-01', '2024-01-31', '2024-02-29'",
  })
  last_upload_at?: Date[];

  @ApiProperty({
    required: false,
    description: 'Created at date for the filters',
    example: "'2024-02-01', '2024-01-31', '2024-02-29'",
  })
  created_at?: Date[];
}

export class UpdateShelfRequestDto {
  @ApiProperty({
    example:
      "'firstShelf' or 'secondShelf' or 'test shelf' or 'test' (string) (optional parameter)",
  })
  name?: string;

  @ApiProperty({
    example: "'1' or '2' or '3' or '4' etc. (string) (optional parameter)",
  })
  stillage?: string;
}

export class FindShelfsResponseDto {
  constructor(shelf: Shelf) {
    this.id = shelf.id;
    this.name = shelf.name;
    this.stillageId = shelf.stillageId;
    this.last_upload_at = shelf.last_upload_at;
    this.created_at = shelf.created_at;
  }

  @ApiProperty({
    description: "Shelf's id",
    example: "'1', '2', '3', '12'...",
  })
  id: string;

  @ApiProperty({
    description: "Stillage's id",
    example: "'1', '2', '3', '12'...",
  })
  stillageId: string;

  @ApiProperty({
    description: "Shelf's name",
    example: "'First shelf', 'Shelf 2', 'Shelf for the Math'",
  })
  name: string;

  @ApiProperty({
    description: 'Last upload date after the filtering',
    example: "'2024-02-01', '2024-01-31', '2024-02-29'",
  })
  last_upload_at: Date;

  @ApiProperty({
    description: 'Created at date after the filtering',
    example: "'2024-02-01', '2024-01-31', '2024-02-29'",
  })
  created_at: Date;
}

export class GetShelvesResponseDto {
  @ApiProperty({
    description: 'Stillage name you are getting by id',
    example: "'Stillage', 'Stillage 2', 'Stillage 3', 'Math'",
  })
  stillageName: string;

  @ApiProperty({
    type: FindShelfsResponseDto,
    description:
      'List of all shelves is possible to get which are belong to the current user',
    isArray: true,
  })
  FindShelfsResponse: FindShelfsResponseDto[];
}

export class UpdateShelfResponseDto {
  constructor(shelf: Shelf) {
    this.id = shelf.id;
    this.name = shelf.name;
    this.stillage = shelf.stillageId;
    this.created_at = shelf.created_at;
    this.last_upload_at = shelf.last_upload_at;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  stillage: string;

  @ApiProperty()
  last_upload_at: Date;

  @ApiProperty()
  created_at: Date;
}

export class DeleteShelfResponseDto {
  constructor(message: string) {
    this.message = message;
  }

  @ApiProperty()
  message: string;
}
