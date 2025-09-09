import {
  ArgumentsHost,
  Catch,
  WsExceptionFilter,
  BadRequestException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException, BadRequestException)
export class SocketExceptionsFilter implements WsExceptionFilter {
  catch(exception: WsException | BadRequestException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const callback = host.getArgByIndex<((data: unknown) => void) | undefined>(
      2,
    );
    const error =
      exception instanceof BadRequestException
        ? exception.getResponse()
        : exception.getError();

    if (typeof callback === 'function') {
      callback(error);
    }

    client.emit('validation_error', error);
  }
}
