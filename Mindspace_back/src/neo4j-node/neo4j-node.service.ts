import { Injectable, OnModuleInit } from '@nestjs/common';
import { CustomNeo4jNodeRepository } from './repository/neo4j-node.repository';
import { nodeLinks, nodeNames } from '../initData/neo4jNodeData';

@Injectable()
export class Neo4jNodeService implements OnModuleInit {
  constructor(
    private readonly customNeo4jNodeRepository: CustomNeo4jNodeRepository,
  ) {}

  async onModuleInit() {
    await this.customNeo4jNodeRepository.initializeDatabase(
      nodeNames,
      nodeLinks,
    );
  }
}
