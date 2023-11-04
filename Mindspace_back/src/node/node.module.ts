import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entities/node.entity';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { NodeMapper } from './dto/node.mapper';
import { Neo4jNodeService } from '../neo4j-node/neo4j-node.service';
import { CustomNodeRepository } from './repository/node.repository';
import { CustomNeo4jNodeRepository } from '../neo4j-node/repository/neo4j-node.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  providers: [
    NodeService,
    NodeMapper,
    Neo4jNodeService,
    CustomNodeRepository,
    CustomNeo4jNodeRepository,
  ],
  controllers: [NodeController],
  exports: [NodeService],
})
export class NodeModule {}
