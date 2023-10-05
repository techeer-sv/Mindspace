import { Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly customCommentRepository: CustomCommentRepository,
    private readonly commentMapper: CommentMapper,
    private readonly userService: UserService,
    private readonly boardService: BoardService,
  ) {}

  async createComment(
    boardId: number,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);

    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    const board = await this.boardService.findBoardById(boardId);

    if (!board) {
      throw new NotFoundException('게시글을 찾을 수 없습니다.');
    }

    const comment = this.commentMapper.DtoToEntity(
      createCommentDto,
      user,
      board,
      user.nickname,
    );
    return await this.commentRepository.save(comment);
  }
  async getCommentsByBoardId(boardId: number, pagingParams: PagingParams) {
    const comments = await this.customCommentRepository.paginate(
      boardId,
      pagingParams,
    );

    const transformedComments: CommentResponseDto[] = comments.data.map(
      (comment) => {
        return CommentMapper.commentToResponseDto(comment);
      },
    );

    return {
      ...comments,
      data: transformedComments,
    };
  }

  async updateComment(
    comment_id: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateCommentDto> {
    const comment = await this.commentRepository.findOne({
      where: { id: comment_id },
    });
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    comment.content = updateCommentDto.content;
    return await this.commentRepository.save(comment);
  }

  async deleteComment(comment_id: number): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: comment_id },
    });
    if (!comment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    await this.commentRepository.remove(comment);
  }
}