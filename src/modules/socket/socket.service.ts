import { Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessageSentResponseDto, SendMessageRequestDto } from 'src/dto/socket';
import client from '../../db/prismaClient';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', () => {
      this.connectedClients.delete(clientId);
    });
  }

  async handleSendMessage(
    socket: Socket,
    sendMessageRequestDto: SendMessageRequestDto,
    userId: string,
  ): Promise<MessageSentResponseDto> {
    let chat = await client.chat.findFirst({
      where: {
        users: {
          some: {
            id: sendMessageRequestDto.target,
          },
        },
      },
      include: { users: true },
    });

    if (!chat) {
      const user = await client.user.findUnique({
        where: { id: sendMessageRequestDto.target },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      chat = await client.chat.create({
        data: {
          users: {
            connect: [{ id: sendMessageRequestDto.target }],
          },
        },
        include: { users: true },
      });
    }

    const message = await client.message.create({
      data: {
        userId: userId,
        chatId: chat.id,
        content: sendMessageRequestDto.content,
        read: false,
      },
    });

    chat.users
      .filter((user) => user.id !== userId)
      .forEach((user) => {
        const clientSocket = this.connectedClients.get(user.id);
        if (clientSocket) {
          clientSocket.emit(
            'message_sent',
            new MessageSentResponseDto(message),
          );
        }
      });

    return new MessageSentResponseDto(message);
  }
}
