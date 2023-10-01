import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from '../user/user.service';
import { CommentMapper } from './dto/comment.mapper.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly commentMapper: CommentMapper,
    private readonly userService: UserService,
  ) {}

  async createComment(
    boardId: number,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    const convertedUserId = Number(userId);
    const user = await this.userService.findUserById(convertedUserId);
    const userNickname = user.nickname;
    const comment = this.commentMapper.DtoToEntity(
      createCommentDto,
      boardId,
      convertedUserId,
      userNickname,
    );
    return await this.commentRepository.save(comment);
  }

  async getCommentsByBoardId(
    boardId: number,
    page: number,
    pageSize: number,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.commentRepository.find({
      where: { boardId },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return comments.map((comment) =>
      CommentMapper.commentToResponseDto(comment),
    );
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
