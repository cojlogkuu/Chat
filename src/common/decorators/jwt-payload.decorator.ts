import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserType } from '../types/auth.types';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user: JwtUserType;
}

export const JwtPayload = createParamDecorator<JwtUserType>(
  (_data: unknown, ctx: ExecutionContext): JwtUserType => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user;
  },
);
