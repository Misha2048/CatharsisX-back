import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { Forum } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  ArrayNotEmpty,
  ArrayUnique,
  Length,
  ArrayMaxSize,
} from 'class-validator';

export class CreateForumRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Title should not be empty' })
  @Length(1, 150, {
    each: true,
    message: 'Title length should be between 1 and 150 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  title: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @ArrayNotEmpty({ message: 'Tags should not be empty' })
  @ArrayUnique({ message: 'Tags should be unique' })
  @ArrayMaxSize(50, { message: 'Maximum 50 tags allowed' })
  @Length(1, 50, {
    each: true,
    message: 'Tag length should be between 1 and 50 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.map((tag) => tag.trim()))
  tags?: string[];

  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class CreateForumSuccesResponseDto {
  constructor(forum: Forum) {
    this.title = forum.title;
    this.tags = forum.tags;
    this.body = forum.body;
    this.forumId = forum.id;
    this.userId = forum.userId;
    this.created_ad = forum.created_at;
    this.last_modified_at = forum.last_modified_at;
  }

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  body: string;

  @ApiProperty()
  forumId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_ad: Date;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_modified_at: Date;
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
  @Min(1, { message: 'Limit must be a positive number greater than zero' })
  @IsNotEmpty()
  limit: number;

  @ApiProperty()
  @IsNumber()
  @Min(0, {
    message: 'Offset must be a positive number or equal to zero',
  })
  @IsNotEmpty()
  offset: number;
}

export class FindForumsDto {
  constructor(forum: Forum) {
    this.title = forum.title;
    this.tags = forum.tags;
    this.body = forum.body;
    this.forumId = forum.id;
    this.userId = forum.userId;
    this.created_ad = forum.created_at;
    this.last_modified_at = forum.last_modified_at;
  }

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  body: string;

  @ApiProperty()
  forumId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_ad: Date;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_modified_at: Date;
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
  @Length(1, 150, {
    message: 'Title length should be between 1 and 150 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({ required: false })
  title?: string;

  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @ApiProperty({ required: false })
  body?: string;
}

export class UpdateForumResponseDto {
  constructor(forum: Forum) {
    this.title = forum.title;
    this.tags = forum.tags;
    this.body = forum.body;
    this.forumId = forum.id;
    this.userId = forum.userId;
    this.created_ad = forum.created_at;
    this.last_modified_at = forum.last_modified_at;
  }

  @ApiProperty()
  title: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty()
  body: string;

  @ApiProperty()
  forumId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_ad: Date;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_modified_at: Date;
}

export class FindForumTopicResponseDto {
  userId: string;
  userFirstName: string;
  userLastName: string;
  title: string;
  body: string;
  tags: string[];
  created_at: Date;
  last_modified_at: Date;
  answers: AnswerDto[];
}

class AnswerDto {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  body: string;
  upvotes: number;
  created_at: Date;
  comments: CommentDto[];
}

class CommentDto {
  id: string;
  userId: string;
  userFirstName: string;
  userLastName: string;
  body: string;
  created_at: Date;
}
