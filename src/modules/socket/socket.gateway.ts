import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import {
  GetChatsRequestDto,
  GetHistoryRequestDto,
  SendMessageRequestDto,
} from 'src/dto/socket';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  async handleConnection(socket: Socket): Promise<void> {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjRlY2QyYmZhLWFhMjQtNDI0Mi05M2Y4LWMyMDM4YzdhZjMyYyIsImlhdCI6MTcxMDc1NjIxNiwiZXhwIjoxNzEwNzU3MTE2fQ.1NtbEMPN1UbhjqyptwmYh9tuGTOTdwHQxi-tL2eBPRc';
    await this.socketService.handleConnection(socket, token);
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    socket: Socket,
    sendMessageRequestDto: SendMessageRequestDto,
  ): Promise<void> {
    await this.socketService.handleSendMessage(socket, sendMessageRequestDto);
  }

  @SubscribeMessage('get_history')
  async handleGetHistory(
    socket: Socket,
    getHistoryRequestDto: GetHistoryRequestDto,
  ): Promise<void> {
    await this.socketService.handleGetHistory(socket, getHistoryRequestDto);
  }

  @SubscribeMessage('get_chats')
  async handleGetChats(
    socket: Socket,
    getChatsRequestDto: GetChatsRequestDto,
  ): Promise<void> {
    await this.socketService.handleGetChats(socket, getChatsRequestDto);
  }
}
