import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET })],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
