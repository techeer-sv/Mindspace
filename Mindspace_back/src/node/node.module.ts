import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entities/node.entity';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { NodeMapper } from './dto/node.mapper';
import { Neo4jNodeService } from '../neo4j-node/neo4j-node.service';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  providers: [NodeService, NodeMapper, Neo4jNodeService],
  controllers: [NodeController],
  exports: [NodeService],
})
export class NodeModule {}
