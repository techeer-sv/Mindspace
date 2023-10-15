import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class TitleNullException extends CustomException {
  constructor() {
    super(ErrorCode.TITLE_NULL, '제목을 입력해주세요.', HttpStatus.BAD_REQUEST);
  }
}
