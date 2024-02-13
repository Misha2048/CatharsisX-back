import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Forum } from '@prisma/client';
import { IsNotEmpty, IsOptional } from 'class-validator';

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

export class FindForumsRequestDto {
  @IsOptional()
  @ApiProperty()
  title?: string;

  @IsNotEmpty()
  @ApiProperty()
  limit: number;
}

export class FindForumsDto {
  constructor(forum: Forum) {
    this.title = forum.title;
    this.tags = forum.tags;
    this.body = forum.body;
  }

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  body: string;
}
export class FindForumsResponseDto {
  @ApiProperty()
  count: number;

  @ApiProperty({
    isArray: true,
    type: FindForumsDto,
  })
  forums: FindForumsDto[];
}

export class UpdateForumRequestDto {
  @ApiProperty()
  title?: string;

  @ApiProperty()
  body?: string;
}

export class UpdateForumResponseDto {
  constructor(forum: Forum) {
    this.title = forum.title;
    this.tags = forum.tags;
    this.body = forum.body;
  }

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  body: string;
}
