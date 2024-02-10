import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAnswerRequestDto {
  @ApiProperty()
  body: string;
}

export class CreateAnswerResponseDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class HTTPError {
  @ApiProperty()
  error: string;

  @ApiProperty()
  statusCode: number;

  constructor(error: string, statusCode: number = HttpStatus.BAD_REQUEST) {
    this.error = error;
    this.statusCode = statusCode;
  }
}
