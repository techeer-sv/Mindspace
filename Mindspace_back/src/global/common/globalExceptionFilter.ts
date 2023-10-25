import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { CustomException } from './customException';
import { ErrorCode } from '../exception/ErrorCode';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    // HTTP 요청과 응답 객체를 가져옵니다.
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    // 예외의 타입에 따라 HTTP 상태 코드를 결정합니다.
    const status =
      exception instanceof CustomException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorCode = ErrorCode.INTERNAL_SERVER_ERROR;
    const message = '서버 오류';

    response.status(status).json({
      errorCode,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
