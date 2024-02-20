import { ApiProperty } from '@nestjs/swagger';
import { Shelf } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';

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
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    required: false,
  })
  name?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsNumberString()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({
    required: false,
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

  @ApiProperty({
    description: "Shelf's id",
  })
  id: string;

  @ApiProperty({
    description: "User's id",
  })
  userId: string;

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

  @ApiProperty({ description: "Stillage's user id" })
  stillageUserId: string;

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

export class CreateShelfRequestDto {
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({ description: "Stillage's ID", example: 'stillageId' })
  stillage: string;

  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({ description: "Shelf's name", example: 'shelfName' })
  name: string;
}

export class CreateShelfNotFoundError {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({
    example: 'User or stillage not found',
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}

export class CreateShelfBadRequestError {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({
    example: 'A shelf with the same name already exists. Specify another name.',
  })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
