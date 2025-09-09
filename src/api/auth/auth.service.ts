import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import {
  JWTTokens,
  AccessToken,
  JWTPayloadType,
} from '../../common/types/auth.types';
import { LoginDto } from './dto/login.dto';
import { Response, Request } from 'express';
import { parseTimeToDate } from '../../common/utils/date-transformer';

@Injectable()
export class AuthService {
  private readonly jwtSecret: string;
  private readonly accessTTL: string;
  private readonly refreshTTL: string;

  constructor(
    private readonly jwt: JwtService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {
    this.jwtSecret = this.configService.getOrThrow('JWT_SECRET');
    this.accessTTL = this.configService.getOrThrow('JWT_ACCESS_TTL');
    this.refreshTTL = this.configService.getOrThrow('JWT_REFRESH_TTL');
  }

  async register(dto: RegisterDto, res: Response): Promise<AccessToken> {
    const existedUser = await this.usersService.findUserByEmail(dto.email);

    if (existedUser) {
      throw new ConflictException('User with this email already exist');
    }

    const hashedPassword = await argon2.hash(dto.password);
    const createdUser = await this.prisma.user.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    return this.generateTokens(createdUser.id, res);
  }

  async login(dto: LoginDto, res: Response): Promise<AccessToken> {
    const { email, password } = dto;

    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    const isPasswordMatch = await argon2.verify(user.password, password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Wrong Password');
    }

    return this.generateTokens(user.id, res);
  }

  async refreshToken(req: Request): Promise<AccessToken> {
    try {
      const token = req.cookies['refresh_token'] as string | undefined;
      if (!token) {
        throw new Error();
      }

      const { sub, type } = await this.jwt.verifyAsync<JWTPayloadType>(token, {
        secret: this.jwtSecret,
      });

      if (type !== 'refresh') {
        throw new Error();
      }

      return {
        accessToken: this.jwt.sign(
          { sub, type: 'access' },
          {
            secret: this.jwtSecret,
            expiresIn: this.accessTTL,
          },
        ),
      };
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }
  }

  private generateTokens(sub: number, res: Response): AccessToken {
    const tokens: JWTTokens = {
      accessToken: this.jwt.sign(
        { sub, type: 'access' },
        { expiresIn: this.accessTTL },
      ),
      refreshToken: this.jwt.sign(
        { sub, type: 'refresh' },
        { expiresIn: this.refreshTTL },
      ),
    };

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: parseTimeToDate(this.refreshTTL),
    });

    return { accessToken: tokens.accessToken };
  }
}
