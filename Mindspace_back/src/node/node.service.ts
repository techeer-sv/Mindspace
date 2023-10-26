import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import { NodeResponseDto } from './dto/node-response.dto';
import { NodeMapper } from './dto/node.mapper';
import { Neo4jNodeService } from '../neo4j-node/neo4j-node.service';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
    private readonly neo4jNodeService: Neo4jNodeService,
    private readonly nodeMapper: NodeMapper,
  ) {}

  async getAllNode(): Promise<NodeResponseDto[]> {
    const nodes = await this.nodeRepository.find();
    return nodes.map((node) => this.nodeMapper.DtoFromEntity(node));
  }

  async isNodeWrittenByUser(
    nodeName: string,
    userId: number,
  ): Promise<boolean> {
    const count = await this.nodeRepository
      .createQueryBuilder('node')
      .innerJoin('node.boards', 'board')
      .where('node.name = :nodeName', { nodeName })
      .andWhere('board.userId = :userId', { userId })
      .getCount();

    return count > 0;
  }

  async getNodeInfoWithLinks(userId: number): Promise<any> {
    // neo4j 노드와 링크를 가져옵니다.
    const neo4jNodes = await this.neo4jNodeService.getNodes();
    const neo4jLinks = await this.neo4jNodeService.getLinks();

    const nodeInfoWithLinks = await Promise.all(
      neo4jNodes.map(async (node) => {
        const isWritten = await this.isNodeWrittenByUser(node.name, userId);

        const pgNode = await this.nodeRepository.findOne({
          where: { name: node.name },
        });
        const nodeId = pgNode ? pgNode.id : null;

        const connectCount = neo4jLinks.filter(
          (link) => link.source === node.id || link.target === node.id,
        ).length; // 해당 노드에 연결된 링크의 수를 계산

        return {
          id: nodeId,
          name: node.name,
          isWritten,
          connectCount, // 해당 노드에 연결된 노드의 수
        };
      }),
    );

    const links = neo4jLinks.map((link) => this.nodeMapper.linkToDto(link));

    return {
      nodes: nodeInfoWithLinks,
      links,
    };
  }

  async findById(nodeId: number): Promise<Node | undefined> {
    return this.nodeRepository.findOne({ where: { id: nodeId } });
  }
}
