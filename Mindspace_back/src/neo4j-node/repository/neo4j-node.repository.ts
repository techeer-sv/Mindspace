import { Injectable } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j';

@Injectable()
export class CustomNeo4jNodeRepository {
  constructor(private readonly neo4jService: Neo4jService) {}

  async clearDatabase(): Promise<void> {
    await this.neo4jService.write('MATCH (n) DETACH DELETE n');
  }

  async createNode(id: number, name: string): Promise<any> {
    return this.neo4jService.write(
      'CREATE (n:Node {id: $id, name: $name}) RETURN n',
      { id, name },
    );
  }

  async createLink(source: number, target: number): Promise<void> {
    await this.neo4jService.write(
      `
      MATCH (a:Node {id: $source}), (b:Node {id: $target})
      CREATE (a)-[r:LINKS_TO]->(b)
      RETURN type(r)
      `,
      { source, target },
    );
  }

  async initializeDatabase(
    nodeNames: string[],
    nodeLinks: any[],
  ): Promise<void> {
    await this.clearDatabase();

    for (let i = 0; i < nodeNames.length; i++) {
      const name = nodeNames[i];
      const id = i + 1;
      await this.createNode(id, name);
    }

    for (const link of nodeLinks) {
      await this.createLink(link.source, link.target);
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
