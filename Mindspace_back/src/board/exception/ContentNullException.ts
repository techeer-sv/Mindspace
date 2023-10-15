import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class ContentNullException extends CustomException {
  constructor() {
    super(
      ErrorCode.CONTENT_NULL,
      '내용을 입력해주세요.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
