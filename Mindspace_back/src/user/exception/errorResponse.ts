import { HttpStatus } from '@nestjs/common';
import { CustomException } from '../../global/common/customException';

export class UserNotFoundException extends CustomException {
  constructor() {
    super('U001', '해당 유저를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
  }
}

export class UserInvalidPasswordException extends CustomException {
  constructor() {
    super('U002', '비밀번호를 다시 확인해주세요.', HttpStatus.BAD_REQUEST);
  }
}

export class UserNicknameDuplicatedException extends CustomException {
  constructor() {
    super('U003', '해당 nickname는 사용 중입니다.', HttpStatus.CONFLICT);
  }
}

export class UserEmailDuplicatedException extends CustomException {
  constructor() {
    super('U004', '이미 해당 Email로 회원가입했습니다.', HttpStatus.CONFLICT);
  }
}

export class UserLoginRequiredException extends CustomException {
  constructor() {
    super('U005', '로그인이 필요합니다.', HttpStatus.UNAUTHORIZED);
  }
}
