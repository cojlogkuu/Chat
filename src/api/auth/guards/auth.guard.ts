import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JWTPayloadType } from '../../../common/types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (!token || type !== 'Bearer') {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      const { sub, type } = await this.jwtService.verifyAsync<
        Promise<JWTPayloadType>
      >(token, {
        secret: this.configService.getOrThrow<string>('JWT_SECRET'),
      });

      if (type !== 'access') {
        throw new Error();
      }

      request['user'] = { sub };

      return true;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
