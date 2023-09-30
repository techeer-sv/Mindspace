import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserService } from '../user/user.service';
import { CommentMapper } from './dto/comment.mapper.dto';

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
    const comment = this.commentMapper.dtoToEntity(
      createCommentDto,
      boardId,
      convertedUserId,
      userNickname,
    );
    return await this.commentRepository.save(comment);
  }
}
