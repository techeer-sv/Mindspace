import { CustomException } from '../../global/common/customException';
import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../../global/exception/ErrorCode';

export class BoardNotFoundException extends CustomException {
  constructor() {
    super(
      ErrorCode.BOARD_NOT_FOUND,
      '해당 게시글을 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
}
