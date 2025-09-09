import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { SocketEventListener } from './socket-event.listener';
import { AuthModule } from '../api/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [SocketGateway, SocketService, SocketEventListener],
})
export class SocketModule {}
