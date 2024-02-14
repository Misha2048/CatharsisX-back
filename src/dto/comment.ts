import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';

export class CreateCommentRequestDto {
  @ApiProperty()
  answerId: string;

  @ApiProperty()
  body: string;
}

export class CreateCommentResponseDto {
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

export class UpdateCommentRequestDto {
  @ApiProperty({ required: false })
  public body?: string = '';
}

export class UpdateCommentResponseDto {
  constructor(comment: Comment) {
    this.body = comment.body;
    this.updated = comment.updated;
  }

  @ApiProperty()
  body: string;

  @ApiProperty()
  updated: boolean;
}
