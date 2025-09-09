import { Socket } from 'socket.io';

export type JWTPayloadType = {
  sub: number;
  type: 'refresh' | 'access';
};

export type JwtUserType = Omit<JWTPayloadType, 'type'>;

export type AccessToken = {
  accessToken: string;
};

export type RefreshToken = {
  refreshToken: string;
};

export type JWTTokens = AccessToken & RefreshToken;

export interface SocketWithUser extends Socket {
  user: JwtUserType;
}
