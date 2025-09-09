import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { JWTPayloadType } from '../types/auth.types';
import { ConfigService } from '@nestjs/config';

export const WsAuthMiddleware =
  (jwtService: JwtService, configService: ConfigService) =>
  (client: Socket, next: (err?: Error) => void) => {
    try {
      const token: string | undefined =
        (client.handshake.auth?.token as string | undefined) ||
        (client.handshake.query?.token as string | undefined);

      if (!token) {
        throw new Error();
      }
      const { sub, type } = jwtService.verify<JWTPayloadType>(token, {
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      });

      if (type !== 'access') {
        throw new Error();
      }

      client['user'] = { sub };

      next();
    } catch {
      next(new WsException('Unauthorized'));
    }
  };
