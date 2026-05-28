import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'Server Error';

    if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || message;
      if (Array.isArray(message)) {
        message = message[0];
      }
    } else {
      message = exceptionResponse as string;
    }

    response.status(status).json({
      ok: false,
      error: message,
    });
  }
}
