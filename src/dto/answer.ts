import { ApiProperty } from '@nestjs/swagger';

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
