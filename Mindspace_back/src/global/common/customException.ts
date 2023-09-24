import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomException extends HttpException {
  constructor(
    private readonly _errorCode: string,
    message: string,
    status: HttpStatus,
  ) {
    super(
      {
        errorCode: _errorCode,
        message: message,
      },
      status,
    );
  }
}
