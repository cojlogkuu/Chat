import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from './guards/auth.guard';
import { WsAuthGuard } from './guards/ws-auth.guard';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        global: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard, WsAuthGuard],
  exports: [AuthGuard, WsAuthGuard, JwtModule],
})
export class AuthModule {}
