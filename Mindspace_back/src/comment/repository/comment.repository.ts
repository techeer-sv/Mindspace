import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { PagingParams } from '../../global/common/type';
import { Comment } from '../entities/comment.entity';

@Injectable()
export class CustomCommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly CommentRepository: Repository<Comment>,
  ) {}

  async paginate(boardId: number, pagingParams?: PagingParams) {
    const queryBuilder = this.CommentRepository.createQueryBuilder('comment')
      .where('comment.board_id = :boardId', { boardId })
      .orderBy('comment.id', 'DESC');

    const paginator = buildPaginator({
      entity: Comment,
      paginationKeys: ['createdAt'],
      query: {
        limit: 10,
        order: 'DESC',
        afterCursor: pagingParams.afterCursor,
        beforeCursor: pagingParams.beforeCursor,
      },
    });

    const paginationResult = await paginator.paginate(queryBuilder);

    return {
      data: paginationResult.data,
      cursor: {
        count: paginationResult.data.length,
        ...paginationResult.cursor,
      },
    };
  }
}
