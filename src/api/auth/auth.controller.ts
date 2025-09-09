import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AccessTokenResponseDto } from './dto/token-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
    type: AccessTokenResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'HttpOnly cookie with refresh token',
        schema: {
          type: 'string',
          example:
            'refresh_token=eyJhbGciOi...; HttpOnly; Secure; Expires=Wed, 10 Sep 2025 12:00:00 GMT',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User with this email already exist',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Wrong data',
  })
  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(dto, res);
  }

  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully login',
    type: AccessTokenResponseDto,
    headers: {
      'Set-Cookie': {
        description: 'HttpOnly cookie with refresh token',
        schema: {
          type: 'string',
          example:
            'refresh_token=eyJhbGciOi...; HttpOnly; Secure; Expires=Wed, 10 Sep 2025 12:00:00 GMT',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User was not found',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Wrong Password',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Wrong data',
  })
  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(dto, res);
  }

  @ApiOperation({ summary: 'Refresh token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns a new access token',
    schema: {
      example: {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @Get('refresh')
  async refreshToken(@Req() req: Request) {
    return this.authService.refreshToken(req);
  }
}
