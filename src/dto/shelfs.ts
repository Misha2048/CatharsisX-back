import { ApiProperty } from '@nestjs/swagger';
import { Shelf } from '@prisma/client';

export class FindShelfsRequestDto {
  @ApiProperty()
  stillage: string;

  @ApiProperty()
  name?: string;

  @ApiProperty()
  last_upload_at?: Date[];

  @ApiProperty()
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
    this.userId = shelf.userId;
    this.name = shelf.name;
    this.stillageId = shelf.stillageId;
    this.last_upload_at = shelf.last_upload_at;
    this.created_at = shelf.created_at;
  }

  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  stillageId: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  last_upload_at: Date;

  @ApiProperty()
  created_at: Date;
}

export class GetShelvesResponseDto {
  @ApiProperty()
  stillageName: string;

  @ApiProperty({ isArray: true, type: FindShelfsResponseDto })
  shelves: FindShelfsResponseDto[];
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
