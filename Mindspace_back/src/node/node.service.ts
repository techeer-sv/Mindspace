import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import { NodeResponseDto } from './dto/node-response.dto';
import { NodeMapper } from './dto/node.mapper';
import { CustomNeo4jNodeRepository } from '../neo4j-node/repository/neo4j-node.repository';
import { initialData } from '../initData/nodeData';
import { CustomNodeRepository } from './repository/node.repository';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node)
    private readonly nodeRepository: Repository<Node>,
    private readonly nodeMapper: NodeMapper,
    private readonly customNeo4jNodeRepository: CustomNeo4jNodeRepository,
    private readonly customNodeRepository: CustomNodeRepository,
  ) {}

  async seedInitialData(): Promise<void> {
    const existingNodes = await this.nodeRepository.count();
    if (existingNodes > 0) {
      // 이미 데이터가 있는 경우 초기화하지 않음
      return;
    }

    for (const data of initialData) {
      const newNode = this.nodeRepository.create(data);
      await this.nodeRepository.save(newNode);
    }
  }

  async getAllNode(): Promise<NodeResponseDto[]> {
    const nodes = await this.nodeRepository.find();
    return nodes.map((node) => this.nodeMapper.DtoFromEntity(node));
  }

  async getNodeInfoWithLinks(userId: string): Promise<any> {
    // neo4j 노드와 링크를 가져옵니다.
    const neo4jNodes = await this.customNeo4jNodeRepository.getNodes();
    const neo4jLinks = await this.customNeo4jNodeRepository.getLinks();

    const nodeInfoWithLinks = await Promise.all(
      neo4jNodes.map(async (node) => {
        const isWritten = await this.customNodeRepository.isNodeWrittenByUser(
          node.name,
          Number(userId),
        );

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
