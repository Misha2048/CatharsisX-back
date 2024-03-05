import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, Length } from 'class-validator';

export class CreateCommentRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'AnswerId should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  answerId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Length(1, 1000, {
    message: 'Body length should be between 1 and 1000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class CreateCommentResponseDto {
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

export class UpdateCommentRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Length(1, 1000, {
    message: 'Body length should be between 1 and 1000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class UpdateCommentResponseDto {
  constructor(comment: Comment) {
    this.body = comment.body;
    this.updated = comment.updated;
    this.created_at = comment.created_at;
  }

  @ApiProperty()
  body: string;

  @ApiProperty()
  updated: boolean;

  @ApiProperty({ default: '2024-01-01T00:00:00.000Z' })
  created_at: Date;
}
