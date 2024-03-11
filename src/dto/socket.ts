import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@prisma/client';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class SendMessageRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(1, 5000, {
    message: 'Content length should be between 1 and 5000 characters',
  })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  content: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  chatId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  userId: string;
}

export class MessageSentResponseDto {
  constructor(message: Message) {
    this.messageId = message.id;
    this.chatId = message.chatId;
  }

  @ApiProperty()
  messageId: string;

  @ApiProperty()
  chatId: string;
}
