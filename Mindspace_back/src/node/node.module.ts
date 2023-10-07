import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Node } from './entities/node.entity';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  controllers: [NodeController],
  providers: [NodeService],
  exports: [NodeService],
})
export class NodeModule {}
