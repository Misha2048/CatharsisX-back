import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Socket } from 'socket.io';
import { MessageSentResponseDto, SendMessageRequestDto } from 'src/dto/socket';
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
    const user = socket['user'];
    const userId = user.id;
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
