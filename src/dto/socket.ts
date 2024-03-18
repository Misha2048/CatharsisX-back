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
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.trim())
  target: string;
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

export class GetHistoryRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  chatId: string;
}

export class GetHistoryResponseDto {
  constructor(messages: Record<string, Message[]>) {
    Object.assign(this, messages);
  }
  [date: string]: Message[];
}

export class GetChatsRequestDto {
  @ApiProperty()
  @IsOptional()
  name?: string;
}

export class ChatInfoResponse {
  @ApiProperty({ description: 'Chat or user id' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ description: 'Number of unread messages' })
  unread: number;
}

export class GetChatsResponseDto {
  @ApiProperty({ type: [ChatInfoResponse], description: 'Existing chats' })
  existing: ChatInfoResponse[];

  @ApiProperty({ type: [ChatInfoResponse], description: 'New chats' })
  new: ChatInfoResponse[];
}
