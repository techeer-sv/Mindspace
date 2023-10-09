import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';
import { HttpStatus } from '@nestjs/common';

export class CommentNotFoundException extends CustomException {
  constructor() {
    super(
      ErrorCode.COMMENT_NOT_FOUND,
      '댓글을 찾을 수 없습니다.',
      HttpStatus.NOT_FOUND,
    );
  }
}
