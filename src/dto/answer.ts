import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';
import { CreateCommentResponseDto } from './comment';

export class CreateAnswerRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  forumId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Length(1, 5000, {
    message: 'Body length should be between 1 and 5000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class CreateAnswerResponseDto {
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

  @ApiProperty({ type: [CreateCommentResponseDto] })
  comments: CreateCommentResponseDto[] | undefined;

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
    this.comments = answer.comment.map(
      (comment) => new CreateCommentResponseDto(comment),
    );
    this.createdAt = answer.created_at;
    this.last_modified_at = answer.last_modified_at;
  }
}

export class UpdateAnswerRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Length(1, 5000, {
    message: 'Body length should be between 1 and 5000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class UpdateAnswerResponseDto {
  constructor(answer: Answer) {
    this.body = answer.body;
    this.upvotes = answer.upvotes;
    this.updated = answer.updated;
    this.created_at = answer.created_at;
    this.last_modified_at = answer.last_modified_at;
  }

  @ApiProperty()
  body: string;

  @ApiProperty()
  upvotes: number;

  @ApiProperty()
  updated: boolean;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_at: Date;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  last_modified_at: Date;
}

export class UpvoteAnswerRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Id should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  id: string;

  @ApiProperty({ description: 'The score (-1 for downvote, 1 for upvote)' })
  @IsNotEmpty()
  score: number;
}

export class UpvoteAnswerResponseDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}
