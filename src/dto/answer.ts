import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateAnswerRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Length(1, 1000, {
    message: 'Body length should be between 1 and 1000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class CreateAnswerResponseDto {
  @ApiProperty()
  message: string;

  constructor(message: string) {
    this.message = message;
  }
}

export class UpdateAnswerRequestDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Body should not be empty' })
  @Length(1, 1000, {
    message: 'Body length should be between 1 and 1000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  body: string;
}

export class UpdateAnswerResponseDto {
  constructor(answer: Answer) {
    this.body = answer.body;
    this.upvotes = answer.upvotes;
    this.updated = answer.updated;
  }

  @ApiProperty()
  body: string;

  @ApiProperty()
  upvotes: number;

  @ApiProperty()
  updated: boolean;
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
