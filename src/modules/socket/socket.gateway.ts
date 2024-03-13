import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { SendMessageRequestDto } from 'src/dto/socket';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) {}

  handleConnection(socket: Socket): void {
    const token = socket.handshake.auth.token;
    this.socketService.handleConnection(socket, token);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    socket: Socket,
    sendMessageRequestDto: SendMessageRequestDto,
  ): void {
    this.socketService.handleSendMessage(socket, sendMessageRequestDto);
  }
}
