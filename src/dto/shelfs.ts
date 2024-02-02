import { ApiProperty } from '@nestjs/swagger';
import { Shelf } from '@prisma/client';

export class FindShelfsRequestDto {
  @ApiProperty({
    description: 'Stillage id (string) of the shelves we want to get',
  })
  stillage: string;

  @ApiProperty({
    required: false,
    description: "Shelf's name",
  })
  name?: string;

  @ApiProperty({
    required: false,
    description:
      'List of last upload dates for the filters ' +
      '(the first element is the start date and the second element is the end date for the search interval)',
    example: ['2024-01-01', '2099-12-31'],
  })
  last_upload_at?: Date[];

  @ApiProperty({
    required: false,
    description:
      'List of Created at dates for the filters ' +
      '(the first element is the start date and the second element is the end date for the search interval)',
    example: ['2024-01-01', '2099-12-31'],
  })
  created_at?: Date[];
}

export class UpdateShelfRequestDto {
  @ApiProperty({
    required: false,
  })
  name?: string;

  @ApiProperty({
    required: false,
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
  })
  id: string;

  @ApiProperty({
    description: "Stillage's id",
  })
  stillageId: string;

  @ApiProperty({
    description: "Shelf's name",
  })
  name: string;

  @ApiProperty({
    description: 'Last upload date after the filtering',
    example: '2024-01-01T00:00:00.000Z',
  })
  last_upload_at: Date;

  @ApiProperty({
    description: 'Created at date after the filtering',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;
}

export class GetShelvesResponseDto {
  @ApiProperty({
    description: 'Stillage name you are getting by id',
  })
  stillageName: string;

  @ApiProperty({
    type: FindShelfsResponseDto,
    description:
      'List of all shelves is possible to get which are belong to the current user',
    isArray: true,
  })
  findShelfsResponse: FindShelfsResponseDto[];
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
