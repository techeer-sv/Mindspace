import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { buildPaginator } from 'typeorm-cursor-pagination';
import { PagingParams } from '../../global/common/type';
import { Board } from '../entities/board.entity';

@Injectable()
export class CustomBoardRepository {
  constructor(
    @InjectRepository(Board)
    private readonly BoardRepository: Repository<Board>,
  ) {}

  async paginate(nodeId: number, pagingParams?: PagingParams) {
    const queryBuilder = this.BoardRepository.createQueryBuilder('board')
      .where('board.node_id = :nodeId', { nodeId })
      .orderBy('board.id', 'DESC');

    const paginator = buildPaginator({
      entity: Board,
      paginationKeys: ['createdAt'],
      query: {
        limit: 10,
        order: 'DESC',
        afterCursor: pagingParams?.afterCursor,
        beforeCursor: pagingParams?.beforeCursor,
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
