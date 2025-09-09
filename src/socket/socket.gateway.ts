import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { Server, Socket } from 'socket.io';
import { MessageDto } from './dto/message.dto';
import {
  UseFilters,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SocketExceptionsFilter } from '../common/filters/socket.filter';
import { SocketLoggerInterceptor } from '../common/interceptors/socket-loger.interceptor';
import { WsJwtPayload } from '../common/decorators/ws-payload.decorator';
import { JwtUserType } from '../common/types/auth.types';
import { WsAuthGuard } from '../api/auth/guards/ws-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { WsAuthMiddleware } from '../common/middleware/ws-auth.middleware';
import { SocketWithUser } from '../common/types/auth.types';

@WebSocketGateway(80, {
  namespace: 'chat',
})
@UseInterceptors(SocketLoggerInterceptor)
@UsePipes(ValidationPipe)
@UseGuards(WsAuthGuard)
export class SocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly socketService: SocketService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  afterInit() {
    this.server.use(WsAuthMiddleware(this.jwtService, this.configService));
  }

  handleConnection(client: SocketWithUser) {
    void client.join(`user_${client.user.sub}`);
  }

  handleDisconnect(client: Socket) {
    console.log(client.id);
  }

  @UseFilters(SocketExceptionsFilter)
  @SubscribeMessage('send_message')
  async handleMessage(
    @MessageBody() dto: MessageDto,
    @WsJwtPayload() user: JwtUserType,
  ) {
    await this.socketService.handlePrivateMessage(user.sub, dto, this.server);
  }
}
