import { Module } from '@nestjs/common';
import { Neo4jNodeService } from './neo4j-node.service';
import { CustomNeo4jNodeRepository } from './repository/neo4j-node.repository';

@Module({
  providers: [Neo4jNodeService, CustomNeo4jNodeRepository],
  exports: [Neo4jNodeService],
})
export class Neo4jNodeModule {}
