import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './create-comment.dto';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CommentMapper {
  dtoToEntity(
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
}
