import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { GetHistoryRequestDto, SendMessageRequestDto } from 'src/dto/socket';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  async handleConnection(socket: Socket): Promise<void> {
    const token = socket.handshake.auth.token;
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
}
