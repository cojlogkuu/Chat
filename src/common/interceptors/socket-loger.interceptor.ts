import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class SocketLoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Socket');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = context.switchToWs().getClient<Socket>();
    const data = context.switchToWs().getData<unknown>();
    const handler = context.getHandler().name;
    const className = context.getClass().name;

    this.logger.debug(
      `📩 [${className}.${handler}] Event from ${client.id}: ${JSON.stringify(
        data,
      )}`,
    );

    return next.handle().pipe(
      tap((result) => {
        this.logger.verbose(
          `📤 [${className}.${handler}] Response to ${client.id}: ${JSON.stringify(
            result,
          )}`,
        );
      }),
    );
  }
}
