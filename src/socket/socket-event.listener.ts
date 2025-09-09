import { Injectable } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SocketEventListener {
  constructor(private readonly gateway: SocketGateway) {}

  @OnEvent('group.notification')
  handleNotification(payload: {
    groupId: number;
    userId: number;
    text: string;
  }) {
    this.gateway.server
      .to(`group_${payload.groupId}`)
      .emit('group_message', payload);
  }
}
