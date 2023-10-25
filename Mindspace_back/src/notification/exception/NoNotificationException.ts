import { HttpException, HttpStatus } from '@nestjs/common';

export class NoNotificationException extends HttpException {
  constructor() {
    super(' notification 찾을 수 없습니다', HttpStatus.NOT_FOUND);
  }
}
