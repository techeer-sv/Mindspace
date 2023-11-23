import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';
import { NodeMapper } from './dto/node.mapper';
import { CustomNeo4jNodeRepository } from '../neo4j-node/repository/neo4j-node.repository';
import { CustomNodeRepository } from './repository/node.repository';
import { Repository } from 'typeorm';
import { initialData } from '../initData/nodeData';

const mockNodeRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
};

const mockNodeMapper = {
  DtoFromEntity: jest.fn(),
  linkToDto: jest.fn(),
};

const mockCustomNeo4jNodeRepository = {
  getNodes: jest.fn(),
  getLinks: jest.fn(),
};

const mockCustomNodeRepository = {
  isNodeWrittenByUser: jest.fn(),
};

describe('NodeService', () => {
  let service: NodeService;
  let nodeRepository: Repository<Node>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NodeService,
        { provide: getRepositoryToken(Node), useValue: mockNodeRepository },
        { provide: NodeMapper, useValue: mockNodeMapper },
        {
          provide: CustomNeo4jNodeRepository,
          useValue: mockCustomNeo4jNodeRepository,
        },
        { provide: CustomNodeRepository, useValue: mockCustomNodeRepository },
      ],
    }).compile();

    service = module.get<NodeService>(NodeService);
    nodeRepository = module.get<Repository<Node>>(getRepositoryToken(Node));
  });

  afterEach(() => {
    // 테스트할 때마다 mock 데이터로 넣어둔 값 초기화
    jest.clearAllMocks();
  });

  describe('seedInitialData', () => {
    it('노드가 존재하지 않을 때 초기 데이터 넣기', async () => {
      mockNodeRepository.count.mockResolvedValue(0);
      const initialTestData = [...initialData];

      await service.seedInitialData();

      expect(mockNodeRepository.count).toHaveBeenCalled();
      expect(mockNodeRepository.create).toHaveBeenCalledTimes(
        initialTestData.length,
      );
      expect(mockNodeRepository.save).toHaveBeenCalledTimes(
        initialTestData.length,
      );
    });

    it('노드가 이미 존재할 때 초기화 진행하지 않기', async () => {
      mockNodeRepository.count.mockResolvedValue(3); // Assuming there are already 3 nodes

      await service.seedInitialData();

      expect(mockNodeRepository.count).toHaveBeenCalled();
      expect(mockNodeRepository.create).not.toHaveBeenCalled();
      expect(mockNodeRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getAllNode', () => {
    it('NodeResponseDto 배열을 반환하는지 확인하기', async () => {
      const mockNodes = [
        { id: 1, name: 'Node 1' },
        { id: 2, name: 'Node 2' },
      ];
      mockNodeRepository.find.mockResolvedValue(mockNodes);
      mockNodeMapper.DtoFromEntity.mockImplementation((node) => ({
        id: node.id,
        name: node.name,
      }));

      const result = await service.getAllNode();

      expect(mockNodeRepository.find).toHaveBeenCalled();
      expect(mockNodeMapper.DtoFromEntity).toHaveBeenCalledTimes(
        mockNodes.length,
      );
      expect(result).toEqual(
        expect.arrayContaining(
          mockNodes.map((node) => ({ id: node.id, name: node.name })),
        ),
      );
    });
  });

  describe('findById', () => {
    it('ID에 해당하는 노드 반환하기', async () => {
      const nodeId = 1;
      const mockNode = { id: 1, name: 'Node 1' };
      mockNodeRepository.findOne.mockResolvedValue(mockNode);

      const result = await service.findById(nodeId);

      expect(mockNodeRepository.findOne).toHaveBeenCalledWith({
        where: { id: nodeId },
      });
      expect(result).toEqual(mockNode);
    });

    it('ID에 해당하는 노드가 없으면 undefined 반환하기', async () => {
      const nodeId = 99; // Assuming a non-existent id
      mockNodeRepository.findOne.mockResolvedValue(undefined);

      const result = await service.findById(nodeId);

      expect(mockNodeRepository.findOne).toHaveBeenCalledWith({
        where: { id: nodeId },
      });
      expect(result).toBeUndefined();
    });
  });
});
