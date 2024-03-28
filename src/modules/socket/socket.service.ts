import { Injectable, NotFoundException } from '@nestjs/common';
import { Socket } from 'socket.io';
import {
  GetChatsRequestDto,
  GetHistoryRequestDto,
  GetHistoryResponseDto,
  MessageReadPesponseDto,
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
      socket.emit('error', {
        message: 'Missing JWT token',
        error: 'Unauthorized',
        status: 401,
      });
      return;
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

      unreadMessages.forEach((message) => {
        socket.emit('message_read', new MessageReadPesponseDto(message));
      });

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

  async handleGetChats(
    socket: Socket,
    getChatsRequestDto: GetChatsRequestDto,
  ): Promise<void> {
    try {
      const user = socket['user'];
      const userId = user.id;

      const responseChats = {
        existing: [],
        new: [],
      };

      let existingChats;

      if (getChatsRequestDto.name) {
        existingChats = await client.chat.findMany({
          where: {
            AND: [
              {
                users: {
                  some: {
                    id: userId,
                  },
                },
              },
              {
                users: {
                  some: {
                    OR: [
                      {
                        first_name: {
                          contains: getChatsRequestDto.name,
                          mode: 'insensitive',
                        },
                      },
                      {
                        last_name: {
                          contains: getChatsRequestDto.name,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                },
              },
            ],
          },
          include: {
            messages: true,
            users: true,
          },
        });
      } else {
        existingChats = await client.chat.findMany({
          where: {
            users: {
              some: {
                id: userId,
              },
            },
          },
          include: {
            messages: true,
            users: true,
          },
        });
      }

      for (const chat of existingChats) {
        const otherUser = chat.users.find(
          (otherUser) => otherUser.id !== userId,
        );
        responseChats.existing.push({
          id: chat.id,
          name: `${otherUser.first_name} ${otherUser.last_name}`,
          unread: chat.messages.filter(
            (message) => !message.read && message.userId !== userId,
          ).length,
        });
      }

      if (getChatsRequestDto.name) {
        const newUsers = await client.user.findMany({
          where: {
            AND: [
              {
                OR: [
                  {
                    first_name: {
                      contains: getChatsRequestDto.name,
                      mode: 'insensitive',
                    },
                  },
                  {
                    last_name: {
                      contains: getChatsRequestDto.name,
                      mode: 'insensitive',
                    },
                  },
                ],
              },
              {
                NOT: {
                  id: userId,
                },
              },
              {
                NOT: {
                  chats: {
                    some: {
                      users: {
                        some: {
                          id: userId,
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        });

        for (const newUser of newUsers) {
          responseChats.new.push({
            id: newUser.id,
            name: `${newUser.first_name} ${newUser.last_name}`,
            unread: 0,
          });
        }
      }

      socket.emit('response_chats', responseChats);
    } catch (error) {
      console.log(error);
      socket.emit('error', {
        message: 'An error occurred while retrieving chats.',
        error: error.message,
        status: error.status,
      });
    }
  }
}
