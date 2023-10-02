import { Injectable } from '@nestjs/common';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { CommentResponseDto } from './comment-response.dto';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';

@Injectable()
export class CommentMapper {
  DtoToEntity(
    createCommentDto: CreateCommentDto,
    user: User,
    board: Board,
    userNickname: string,
  ): Comment {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.user = user;
    comment.board = board;
    comment.userNickname = userNickname;
    return comment;
  }

  static commentToResponseDto(comment: Comment): CommentResponseDto {
    return {
      id: comment.id,
      userNickname: comment.userNickname,
      content: comment.content,
      updatedAt: formatDistanceToNow(comment.updatedAt, {
        addSuffix: true,
        locale: ko,
      }),
    };
  }
}
