import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDto } from './dto/message.dto';
import { Server } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketService {
  constructor(private readonly prismaService: PrismaService) {}

  async handlePrivateMessage(
    senderId: number,
    dto: MessageDto,
    server: Server,
  ) {
    const { receiverId, message } = dto;

    const receiver = await this.prismaService.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      throw new WsException('Receiver not found');
    }

    await this.prismaService.privateMessage.create({
      data: {
        receiverId,
        senderId,
        text: message,
      },
    });

    server.to(`user_${receiverId}`).emit('receive_message', {
      senderId,
      message,
    });
  }
}
