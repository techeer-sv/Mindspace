import { CustomException } from '../../global/common/customException';
import { ErrorCode } from '../../global/exception/ErrorCode';
import { HttpStatus } from '@nestjs/common';

export class CommentPermissionDeniedException extends CustomException {
  constructor() {
    super(
      ErrorCode.COMMENT_PERMISSION_DENIED,
      '댓글을 수정 또는 삭제할 권한이 없습니다.',
      HttpStatus.BAD_REQUEST,
    );
  }
}
