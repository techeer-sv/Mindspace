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

  async seedInitialData(): Promise<void> {
    const existingNodes = await this.nodeRepository.count();
    if (existingNodes > 0) {
      // 이미 데이터가 있는 경우 초기화하지 않음
      return;
    }

    const initialData = [
      { id: 1, name: 'Javascript' },
      { id: 2, name: 'Webpack' },
      { id: 3, name: 'React' },
      { id: 4, name: 'JavaScript Immutability' },
      { id: 5, name: 'Ajax' },
      { id: 6, name: 'React Route' },
      { id: 7, name: 'State Management' },
      { id: 8, name: 'Class vs Component' },
      { id: 9, name: 'React Query' },
      { id: 10, name: 'Jest' },
      { id: 11, name: 'ES6' },
      { id: 12, name: 'Redux' },
      { id: 13, name: 'Mobx' },
      { id: 14, name: 'Zustand' },
      { id: 15, name: 'Recoil' },
      { id: 16, name: 'Redux saga' },
      { id: 17, name: 'Redux toolkit' },
      { id: 18, name: 'Browser Render' },
      { id: 19, name: 'HTML' },
      { id: 20, name: 'Proxy' },
      { id: 21, name: 'Auth' },
      { id: 22, name: 'OAuth2.0' },
      { id: 23, name: 'FaceBook Login' },
      { id: 24, name: 'Kakao Login' },
      { id: 25, name: 'Bearer Auth' },
      { id: 26, name: 'JWT Token' },
      { id: 27, name: 'CSS' },
      { id: 28, name: 'CSS vs CSS in JS' },
      { id: 29, name: 'SASS' },
      { id: 30, name: 'Tailwind' },
      { id: 31, name: 'Bootstrap' },
      { id: 32, name: 'Styled-compoent' },
      { id: 33, name: 'Material-UI' },
    ];

    for (const data of initialData) {
      const newNode = this.nodeRepository.create(data);
      await this.nodeRepository.save(newNode);
    }
  }

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
