import { Injectable, OnModuleInit } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class Neo4jNodeService implements OnModuleInit {
  constructor(private readonly neo4jService: Neo4jService) {}

  nodeNames = [
    'Javascript',
    'Webpack',
    'React',
    'JavaScript Immutability',
    'Ajax',
    'React Route',
    'State Management',
    'Class vs Component',
    'React Query',
    'Jest',
    'ES6',
    'Redux',
    'Mobx',
    'Zustand',
    'Recoil',
    'Redux saga',
    'Redux toolkit',
    'Browser Render',
    'HTML',
    'Proxy',
    'Auth',
    'OAuth2.0',
    'FaceBook Login',
    'Kakao Login',
    'Bearer Auth',
    'JWT Token',
    'CSS',
    'CSS vs CSS in JS',
    'SASS',
    'Tailwind',
    'Bootstrap',
    'Styled-compoent',
    'Material-UI',
  ];

  nodeLinks = [
    {
      source: 1,
      target: 2,
    },
    {
      source: 1,
      target: 4,
    },
    {
      source: 1,
      target: 5,
    },
    {
      source: 3,
      target: 6,
    },
    {
      source: 3,
      target: 7,
    },
    {
      source: 3,
      target: 8,
    },
    {
      source: 3,
      target: 9,
    },
    {
      source: 3,
      target: 10,
    },
    {
      source: 1,
      target: 11,
    },
    {
      source: 7,
      target: 12,
    },
    {
      source: 7,
      target: 13,
    },
    {
      source: 7,
      target: 14,
    },
    {
      source: 7,
      target: 15,
    },
    {
      source: 12,
      target: 16,
    },
    {
      source: 12,
      target: 17,
    },
    {
      source: 18,
      target: 19,
    },
    {
      source: 5,
      target: 20,
    },
    {
      source: 21,
      target: 22,
    },
    {
      source: 21,
      target: 25,
    },
    {
      source: 21,
      target: 26,
    },
    {
      source: 22,
      target: 23,
    },
    {
      source: 22,
      target: 24,
    },
    {
      source: 27,
      target: 19,
    },
    {
      source: 27,
      target: 28,
    },
    {
      source: 27,
      target: 29,
    },
    {
      source: 27,
      target: 30,
    },
    {
      source: 27,
      target: 31,
    },
    {
      source: 27,
      target: 32,
    },
    {
      source: 27,
      target: 33,
    },
  ];

  private async clearDatabase(): Promise<void> {
    await this.neo4jService.write('MATCH (n) DETACH DELETE n');
  }

  private async createNodes(nodeNames: string[]): Promise<any[]> {
    const createdNodes = [];

    for (let i = 0; i < nodeNames.length; i++) {
      const name = nodeNames[i];
      const id = i + 1; // 사용자 정의 ID 생성
      const result = await this.neo4jService.write(
        'CREATE (n:Node {id: $id, name: $name}) RETURN n',
        { id, name }, // 사용자 정의 ID와 이름을 노드에 할당
      );
      createdNodes.push(result.records);
    }

    return createdNodes;
  }
  async onModuleInit() {
    await this.clearDatabase();

    const createdNodes = await this.createNodes(this.nodeNames);
    if (createdNodes.length > 0) {
      await this.createLinks(this.nodeLinks);
    }
  }

  async createLinks(
    links: { source: number; target: number }[],
  ): Promise<void> {
    for (const link of links) {
      await this.neo4jService.write(
        `
      MATCH (a:Node {id: $source}), (b:Node {id: $target})
      CREATE (a)-[r:LINKS_TO]->(b)
      RETURN type(r)
      `,
        { source: link.source, target: link.target },
      );
    }
  }

  async getNodes(): Promise<any[]> {
    const result = await this.neo4jService.read(
      'MATCH (n:Node) RETURN n, ID(n) as id',
    );
    return result.records.map((record) => {
      return record.get('n').properties;
    });
  }

  async getLinks(): Promise<any[]> {
    const result = await this.neo4jService.read(
      `
      MATCH (a)-[r]->(b)
      RETURN a.id AS source, b.id AS target
      `,
    );
    return result.records.map((record) => ({
      source: Number(record.get('source')),
      target: Number(record.get('target')),
    }));
  }
}
