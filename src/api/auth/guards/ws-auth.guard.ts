import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTPayloadType } from '../../../common/types/auth.types';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient<Socket>();
    const token: string | undefined =
      (client.handshake.auth?.token as string | undefined) ||
      (client.handshake.query?.token as string | undefined);

    if (!token) {
      throw new WsException('Unauthorized');
    }

    try {
      const { type } = await this.jwtService.verifyAsync<
        Promise<JWTPayloadType>
      >(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      if (type !== 'access') {
        throw new Error();
      }

      return true;
    } catch {
      throw new WsException('Unauthorized');
    }
  }
}
