import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
import { User } from '../user/entities/user.entity';
import { Board } from '../board/entities/board.entity';
import { PutCommentDto } from './dto/put-comment.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { CommentSingleResponseDto } from './dto/comment-single-response.dto';

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

  private async validateUserExists(userId: string): Promise<User> {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);
    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  private async validateBoardExists(boardId: number): Promise<Board> {
    const board = await this.boardService.findBoardById(boardId);
    if (!board) {
      throw new BoardNotFoundException();
    }
    return board;
  }

  /** 댓글 작성 */
  async createComment(
    boardId: number,
    userId: string,
    createCommentDto: CreateCommentDto,
    parentId?: number,
  ): Promise<CommentSingleResponseDto> {
    console.log(
      `[createComment] Started comment creation for board ${boardId} by user ${userId}`,
    );

    const user: User = await this.validateUserExists(userId);
    const board: Board = await this.validateBoardExists(boardId);

    const comment: Comment = this.commentMapper.DtoToEntity(
      createCommentDto,
      user,
      board,
      user.nickname,
    );
    const savedComment = await this.commentRepository.save(comment);

    // 알림 서비스의 createNotificationForBoardOwner 메서드를 호출하여 알림 생성 및 전송
    await this.notificationService.createNotificationForBoardOwner({
      board: board,
      message: `${user.nickname}님이 ${board.title}에 댓글을 작성했습니다.`,
      commentId: savedComment.id,
      nodeId: board.node.id,
      userId: board.user.id,
    });

    // 댓글을 생성한 사용자의 userId를 확인하고, 해당 사용자를 기반으로 알림 대기 중인 사용자를 찾습니다.
    const waitingUser = this.notificationService.waitingClients.find(
      (client) => client.userId === Number(userId),
    );

    if (waitingUser) {
      // 알림을 대기하고 있는 사용자에게 알림을 전송합니다.
      await this.notificationService.createNotificationForBoardOwner({
        board: board,
        message: `새로운 댓글이 작성되었습니다.`,
        commentId: savedComment.id,
        nodeId: board.node.id,
        userId: Number(userId),
      });
    }

    console.log(
      `[createComment] Finished comment creation for board ${boardId} by user ${userId}`,
    );

    // 대댓글 작성
    if (parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: Number(parentId) },
        relations: ['parent'],
      });

      if (!parentComment) {
        throw new NotFoundException('부모 댓글을 찾을 수 없습니다.');
      }

      if (parentComment.parent) {
        throw new BadRequestException('대댓글의 대댓글은 작성할 수 없습니다.');
      }

      comment.parent = parentComment;
    }

    const createComment: Comment = await this.commentRepository.save(comment);
    return this.commentMapper.DtoFromEntity(createComment);
  }

  /** 댓글 목록 조회 */
  async getCommentsByBoardId(
    boardId: number,
    userId: string,
    pagingParams?: CursorPaginationDto,
  ) {
    await this.validateUserExists(userId);
    await this.validateBoardExists(boardId);

    const comments = await this.customCommentRepository.paginate(
      boardId,
      pagingParams,
    );

    const transformedComments: CommentResponseDto[] = await Promise.all(
      comments.data.map(async (comment) => {
        const replies = await this.customCommentRepository.findReplies(
          comment.id,
        );
        const transformedReplies = replies.map((reply) =>
          CommentMapper.commentToResponseDto(reply, userId),
        );

        return {
          ...CommentMapper.commentToResponseDto(comment, userId),
          replies: transformedReplies,
        };
      }),
    );

    return {
      ...comments,
      data: transformedComments,
    };
  }

  /** 댓글 수정 */
  async updateComment(
    commentId: number,
    userId: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<PutCommentDto> {
    const comment: Comment = await this.validateCommentOwner(
      Number(commentId),
      userId,
    );
    comment.content = updateCommentDto.content;
    const UpdateComment: Comment = await this.commentRepository.save(comment);
    return this.commentMapper.DtoFromEntity(UpdateComment);
  }

  /** 댓글 삭제 */
  async deleteComment(commentId: number, userId: string): Promise<void> {
    const comment: Comment = await this.validateCommentOwner(commentId, userId);
    comment.content = '삭제된 댓글입니다.';
    await this.commentRepository.save(comment);
  }

  /** 댓글을 찾고 예외를 확인합니다. */
  private async validateCommentOwner(
    commentId: number,
    userId: string,
  ): Promise<Comment> {
    const convertedUserId = Number(userId);
    const user: User = await this.userService.findUserById(convertedUserId);

    if (!user) {
      throw new UserNotFoundException();
    }

    const comment: Comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['user'],
    });

    if (!comment) {
      throw new CommentNotFoundException();
    }

    if (comment.user.id !== convertedUserId) {
      throw new CommentPermissionDeniedException();
    }

    return comment;
  }
}
