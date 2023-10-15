import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class UserLoginRequiredException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_LOGIN_REQUIRED,
      '로그인이 필요합니다.',
      HttpStatus.UNAUTHORIZED,
    );
  }
}
