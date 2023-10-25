import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { nodeId } from 'nest-neo4j/dist/test';

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

  async createComment(
    boardId: number,
    userId: string,
    createCommentDto: CreateCommentDto,
    parentId?: number,
  ): Promise<Comment> {
    console.log(
      `[createComment] Started comment creation for board ${boardId} by user ${userId}`,
    );
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

    // 알림 서비스의 createNotificationForBoardOwner 메서드를 호출하여 알림 생성 및 전송
    await this.notificationService.createNotificationForBoardOwner({
      board: board,
      message: `${user.nickname}님이 ${board.title}에 댓글을 작성했습니다.`,
      commentId: savedComment.id,
      nodeId: board.nodeId,
      userId: board.userId,
    });

    // 댓글을 생성한 사용자의 userId를 확인하고, 해당 사용자를 기반으로 알림 대기 중인 사용자를 찾습니다.
    const commentUserId = convertedUserId;
    const waitingUser = this.notificationService.waitingClients.find(
      (client) => client.userId === commentUserId,
    );

    if (waitingUser) {
      // 알림을 대기하고 있는 사용자에게 알림을 전송합니다.
      await this.notificationService.createNotificationForBoardOwner({
        board: board,
        message: `새로운 댓글이 작성되었습니다.`,
        commentId: savedComment.id,
        nodeId: board.nodeId,
        userId: commentUserId,
      });
    }

    console.log(
      `[createComment] Finished comment creation for board ${boardId} by user ${userId}`,
    );

    if (parentId) {
      const parentComment = await this.commentRepository.findOne({
        where: { id: parentId },
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

    return await this.commentRepository.save(comment);
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
