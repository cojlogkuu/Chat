import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { JwtPayload } from '../../common/decorators/jwt-payload.decorator';
import { JWTPayloadType } from '../../common/types/auth.types';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  async getUserInfo(@JwtPayload() user: JWTPayloadType) {
    return this.usersService.getUserInfo(user.sub);
  }
}
