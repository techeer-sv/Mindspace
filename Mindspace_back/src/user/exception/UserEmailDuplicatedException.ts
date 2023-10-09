import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class UserEmailDuplicatedException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_EMAIL_DUPLICATED,
      '이미 해당 Email로 회원가입했습니다.',
      HttpStatus.CONFLICT,
    );
  }
}
