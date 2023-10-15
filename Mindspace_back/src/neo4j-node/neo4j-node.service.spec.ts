import { Test, TestingModule } from '@nestjs/testing';
import { Neo4jNodeService } from './neo4j-node.service';

describe('Neo4jNodeService', () => {
  let service: Neo4jNodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Neo4jNodeService],
    }).compile();

    service = module.get<Neo4jNodeService>(Neo4jNodeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
