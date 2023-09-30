import { Injectable } from '@nestjs/common';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../entities/comment.entity';
import { CommentResponseDto } from './comment-response.dto';

@Injectable()
export class CommentMapper {
  DtoToEntity(
    createCommentDto: CreateCommentDto,
    boardId: number,
    userId: number,
    userNickname: string,
  ): Comment {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.boardId = boardId;
    comment.userId = userId;
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
