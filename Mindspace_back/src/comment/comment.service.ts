import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PagingParams } from '../global/common/type';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from '../user/user.service';
import { CommentMapper } from './dto/comment.mapper.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { BoardService } from '../board/board.service';
import { CustomCommentRepository } from './repository/comment.repository';
import { CommentPermissionDeniedException } from './exception/CommentPermissionDeniedException';
import { CommentNotFoundException } from './exception/CommentNotFoundException';
import { UserNotFoundException } from '../user/exception/UserNotFoundException';
import { BoardNotFoundException } from '../board/exception/BoardNotFoundException';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly customCommentRepository: CustomCommentRepository,
    private readonly commentMapper: CommentMapper,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
    private readonly notificationService: NotificationService,
  ) {}

  /** 댓글 생성 */
  async createComment(
    boardId: number,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BoardNotFoundException();
    }

    const comment = this.commentMapper.DtoToEntity(
      createCommentDto,
      user,
      board,
      user.nickname,
    );
    const savedComment = await this.commentRepository.save(comment);

    // 댓글이 성공적으로 생성된 후 알림 생성
    const notificationData = {
      board: board,
      message: `${user.nickname}님이 ${board.title}에 댓글을 작성했습니다.`,
      commentId: savedComment.id,
      nodeId: board.nodeId,
    };

    await this.notificationService.createNotificationForBoardOwner(
      notificationData,
    );

    return savedComment;
  }

  /** 댓글 목록 조회 */
  async getCommentsByBoardId(
    boardId: number,
    userId: string,
    pagingParams: PagingParams,
  ) {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new BoardNotFoundException();
    }

    const comments = await this.customCommentRepository.paginate(
      boardId,
      pagingParams,
    );

    const transformedComments: CommentResponseDto[] = comments.data.map(
      (comment) => {
        return CommentMapper.commentToResponseDto(comment, userId);
      },
    );

    return {
      ...comments,
      data: transformedComments,
    };
  }

  /** 댓글 수정 */
  async updateComment(
    comment_id: number,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateCommentDto> {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const comment = await this.commentRepository.findOne({
      where: { id: comment_id },
      relations: ['user'],
    });

    if (!comment) {
      throw new CommentNotFoundException();
    }

    if (comment.user.id.toString() !== userId) {
      throw new CommentPermissionDeniedException();
    }

    comment.content = updateCommentDto.content;
    return await this.commentRepository.save(comment);
  }

  /** 댓글 삭제 */
  async deleteComment(comment_id: number, userId: string): Promise<void> {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const comment = await this.commentRepository.findOne({
      where: { id: comment_id },
      relations: ['user'],
    });

    if (!comment) {
      throw new CommentNotFoundException();
    }

    if (comment.user.id.toString() !== userId) {
      throw new CommentPermissionDeniedException();
    }

    await this.commentRepository.remove(comment);
  }
}
