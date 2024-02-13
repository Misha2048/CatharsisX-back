import { ApiProperty } from '@nestjs/swagger';
import { Answer } from '@prisma/client';

export class CreateAnswerRequestDto {
  @ApiProperty()
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
  public body?: string = '';
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
