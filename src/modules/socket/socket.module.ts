import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.ACCESS_TOKEN_SECRET }),
    UsersModule,
  ],
  providers: [SocketGateway, SocketService],
})
export class SocketModule {}
