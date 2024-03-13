import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { SendMessageRequestDto } from 'src/dto/socket';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(
    private readonly socketService: SocketService,
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(socket: Socket): void {
    const token = socket.handshake.auth.token;

    if (!token) {
      throw new UnauthorizedException('Missing JWT token');
    }

    const payload = this.jwtService.verify(token);
    socket['user'] = payload;
    this.socketService.handleConnection(socket);
  }

  @SubscribeMessage('send_message')
  handleSendMessage(
    socket: Socket,
    sendMessageRequestDto: SendMessageRequestDto,
  ): void {
    const user = socket['user'];
    const userId = user.id;
    this.socketService.handleSendMessage(socket, sendMessageRequestDto, userId);
  }
}
