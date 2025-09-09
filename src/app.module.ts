import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GroupsModule } from './api/groups/groups.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EventEmitterModule.forRoot({
      ignoreErrors: false,
      delimiter: '.',
    }),
    PrismaModule,
    SocketModule,
    AuthModule,
    UsersModule,
    GroupsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
