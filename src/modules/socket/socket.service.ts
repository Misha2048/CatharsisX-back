import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  GetHistoryRequestDto,
  GetHistoryResponseDto,
  MessageSentResponseDto,
  SendMessageRequestDto,
} from 'src/dto/socket';
import client from '../../db/prismaClient';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class SocketService {
  private readonly connectedClients: Map<string, Socket> = new Map();

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async handleConnection(socket: Socket, token: string): Promise<void> {
    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token);
      const user = await this.usersService.findById(payload.id);

      socket['user'] = user;
      const clientId = socket.id;
      this.connectedClients.set(clientId, socket);

      socket.on('disconnect', () => {
        this.connectedClients.delete(clientId);
      });
    } catch (error) {
      socket.disconnect(true);
    }
  }

  async handleSendMessage(
    socket: Socket,
    sendMessageRequestDto: SendMessageRequestDto,
  ): Promise<MessageSentResponseDto> {
    try {
      const user = socket['user'];
      const userId = user.id;
      let chat = await client.chat.findFirst({
        where: {
          id: sendMessageRequestDto.target,
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

        chat = await client.chat.findFirst({
          where: {
            users: { some: { id: sendMessageRequestDto.target } },
          },
          include: { users: true },
        });

        if (!chat) {
          chat = await client.chat.create({
            data: {
              users: {
                connect: [{ id: sendMessageRequestDto.target }, { id: userId }],
              },
            },
            include: { users: true },
          });
        }
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
        .filter((chatUser) => chatUser.id !== userId)
        .forEach((chatUser) => {
          const clientSocket = this.connectedClients.get(chatUser.id);
          if (clientSocket) {
            clientSocket.emit(
              'message_sent',
              new MessageSentResponseDto(message),
            );
          }
        });

      return new MessageSentResponseDto(message);
    } catch (error) {
      socket.emit('error', {
        message: 'An error occurred while sending the message.',
        error: error.message,
        status: error.status,
      });
    }
  }

  async handleGetHistory(
    socket: Socket,
    getHistoryRequestDto: GetHistoryRequestDto,
  ): Promise<void> {
    try {
      const history = await client.message.findMany({
        where: { chatId: getHistoryRequestDto.chatId },
        orderBy: {
          created_at: 'asc',
        },
      });

      const unreadMessages = history.filter(
        (message) => message.read === false,
      );

      for (const message of unreadMessages) {
        await client.message.update({
          where: { id: message.id },
          data: { read: true },
        });
      }

      const groupedMessages = history.reduce((acc, message) => {
        const dateKey = message.created_at.toISOString();
        acc[dateKey] = acc[dateKey] || [];
        acc[dateKey].push(message);
        return acc;
      }, {});

      socket.emit(
        'response_history',
        new GetHistoryResponseDto(groupedMessages),
      );
    } catch (error) {
      socket.emit('error', {
        message: 'An error occurred while retrieving message history.',
        error: error.message,
        status: error.status,
      });
    }
  }
}
