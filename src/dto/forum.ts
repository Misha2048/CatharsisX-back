import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Forum } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

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
  @ApiProperty({ required: false })
  @IsOptional()
  title?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Limit must be a non-negative number' })
  @IsNotEmpty()
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
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({ required: false })
  public title?: string = '';

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({ required: false })
  public body?: string = '';
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
