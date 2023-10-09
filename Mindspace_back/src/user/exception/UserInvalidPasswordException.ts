import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class UserInvalidPasswordException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_INVALID_PASSWORD,
      '비밀번호를 다시 확인해주세요.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
