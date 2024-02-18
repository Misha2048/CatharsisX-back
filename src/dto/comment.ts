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
  message: string;

  constructor(message: string) {
    this.message = message;
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
  }

  @ApiProperty()
  body: string;

  @ApiProperty()
  updated: boolean;
}
