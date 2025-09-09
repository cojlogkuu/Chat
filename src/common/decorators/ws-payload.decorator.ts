import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserType } from '../types/auth.types';
import { SocketWithUser } from '../types/auth.types';

export const WsJwtPayload = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtUserType => {
    const client = ctx.switchToWs().getClient<SocketWithUser>();
    return client.user;
  },
);
