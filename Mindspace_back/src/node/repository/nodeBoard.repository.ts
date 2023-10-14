import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Board } from '../../board/entities/board.entity';

@Injectable()
export class nodeBoardRepository extends Repository<Board> {
  async getNodeListWithWriteStatus(
    userId: number,
  ): Promise<Array<{ id: number; isWritten: boolean; name: string }>> {
    return this.createQueryBuilder('board')
      .leftJoin('board.node', 'node')
      .select([
        'node.id AS id',
        'CASE WHEN board.id IS NULL THEN false ELSE true END AS isWritten',
        'node.name AS name',
      ])
      .where('board.user.id = :userId', { userId })
      .getRawMany();
  }
}
