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
    this.created_at = forum.created_at;
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
  created_at: Date;

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
    this.created_at = forum.created_at;
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
  created_at: Date;

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
    this.created_at = forum.created_at;
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
  created_at: Date;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_modified_at: Date;
}

class CommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userFirstName: string;

  @ApiProperty()
  userLastName: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  answerId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  last_modified_at: Date;

  constructor(comment: {
    id: string;
    userId: string;
    user: { id: string; first_name: string; last_name: string };
    body: string;
    answerId: string;
    created_at: Date;
    last_modified_at: Date;
  }) {
    this.id = comment.id;
    this.userId = comment.userId;
    this.userFirstName = comment.user.first_name;
    this.userLastName = comment.user.last_name;
    this.body = comment.body;
    this.answerId = comment.answerId;
    this.createdAt = comment.created_at;
    this.last_modified_at = comment.last_modified_at;
  }
}

class AnswerDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userFirstName: string;

  @ApiProperty()
  userLastName: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  upvotes: number;

  @ApiProperty({ type: [CommentDto] })
  comments: CommentDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  last_modified_at: Date;

  constructor(answer: {
    id: string;
    userId: string;
    user: { id: string; first_name: string; last_name: string };
    body: string;
    upvotes: number;
    comment: {
      id: string;
      userId: string;
      user: { id: string; first_name: string; last_name: string };
      body: string;
      answerId: string;
      created_at: Date;
      last_modified_at: Date;
    }[];
    created_at: Date;
    last_modified_at: Date;
  }) {
    this.id = answer.id;
    this.userId = answer.userId;
    this.userFirstName = answer.user.first_name;
    this.userLastName = answer.user.last_name;
    this.body = answer.body;
    this.upvotes = answer.upvotes;
    this.comments = answer.comment.map((comment) => new CommentDto(comment));
    this.createdAt = answer.created_at;
    this.last_modified_at = answer.last_modified_at;
  }
}

export class FindForumTopicResponseDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  userFirstName: string;

  @ApiProperty()
  userLastName: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  body: string;

  @ApiProperty()
  tags: string[];

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  last_modified_at: Date;

  @ApiProperty({ type: [AnswerDto] })
  answers: AnswerDto[];

  constructor(forumTopic: any) {
    this.userId = forumTopic.userId;
    this.userFirstName = forumTopic.user.first_name;
    this.userLastName = forumTopic.user.last_name;
    this.title = forumTopic.title;
    this.body = forumTopic.body;
    this.tags = forumTopic.tags;
    this.created_at = forumTopic.created_at;
    this.last_modified_at = forumTopic.last_modified_at;
    this.answers = forumTopic.answer.map(
      (answer: any) => new AnswerDto(answer),
    );
  }
}
