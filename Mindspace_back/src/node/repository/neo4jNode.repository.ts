import { EntityRepository, Repository } from 'typeorm';
import { Neo4jNode } from '../entities/neo4jNode.entity';
import { Link } from '../entities/link.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Neo4jNodeRepository extends Repository<Neo4jNode> {
  async findAllLinks(): Promise<Link[]> {
    const query = this.createQueryBuilder('neo4jNode')
      .innerJoin('neo4jNode.links', 'link')
      .select(['neo4jNode.id as source', 'link.target as target'])
      .orderBy('source', 'ASC')
      .addOrderBy('target', 'ASC');

    return query.getRawMany();
  }
}
