import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class UserNotFoundException extends CustomException {
  constructor() {
    super(
      ErrorCode.USER_NOT_FOUND,
      '해당 유저를 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
}
