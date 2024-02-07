import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateForumRequestDto {
  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  body: string;
}

export class CreateForumSuccesResponseDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class CreateForumErrorResponseDto {
  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;

  constructor(error: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    this.error = error;
    this.statusCode = statusCode;
  }
}
