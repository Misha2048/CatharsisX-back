import { ApiProperty } from '@nestjs/swagger';
import { Comment } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'AnswerId should not be empty' })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  answerId: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
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
