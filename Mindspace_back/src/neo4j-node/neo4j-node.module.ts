import { Module } from '@nestjs/common';
import { Neo4jNodeService } from './neo4j-node.service';

@Module({
  providers: [Neo4jNodeService],
  exports: [Neo4jNodeService],
})
export class Neo4jNodeModule {}
