import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class UserNicknameDuplicatedException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_NICKNAME_DUPLICATED,
      '해당 nickname는 사용 중입니다.',
      HttpStatus.CONFLICT,
    );
  }
}
