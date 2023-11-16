import { InjectRepository } from '@nestjs/typeorm';
import { Node } from '../entities/node.entity';
import { Repository } from 'typeorm';

export class CustomNodeRepository {
  constructor(
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
  ) {}

  async isNodeWrittenByUser(
    nodeName: string,
    userId: number,
  ): Promise<boolean> {
    const count = await this.nodeRepository
      .createQueryBuilder('node')
      .innerJoin('node.boards', 'board')
      .where('node.name = :nodeName', { nodeName })
      .andWhere('board.user_id = :userId', { userId })
      .getCount();
    return count > 0;
  }
}
