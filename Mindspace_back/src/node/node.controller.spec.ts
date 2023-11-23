import { Test, TestingModule } from '@nestjs/testing';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';

const MockNodeService = {
  getAllNode: jest.fn(),
  getNodeInfoWithLinks: jest.fn(),
};

describe('NodeController', () => {
  let controller: NodeController;
  let nodeService: NodeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodeController],
      providers: [{ provide: NodeService, useValue: MockNodeService }],
    }).compile();

    controller = module.get<NodeController>(NodeController);
    nodeService = module.get<NodeService>(NodeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all nodes', async () => {
    MockNodeService.getAllNode.mockResolvedValue([
      {
        id: 1,
        name: 'Node 1',
      },
      {
        id: 2,
        name: 'Node 2',
      },
    ]);

    const nodes = await controller.getAllNode();

    expect(nodes).toEqual([
      {
        id: 1,
        name: 'Node 1',
      },
      {
        id: 2,
        name: 'Node 2',
      },
    ]);
  });

  it('should return node map info', async () => {
    MockNodeService.getNodeInfoWithLinks.mockResolvedValue([
      {
        id: 1,
        name: 'Node 1',
        links: [
          {
            id: 2,
            name: 'Node 2',
          },
          {
            id: 3,
            name: 'Node 3',
          },
        ],
      },
    ]);

    const nodes = await controller.getNodeInfoWithLinks(1);

    expect(nodes).toEqual([
      {
        id: 1,
        name: 'Node 1',
        links: [
          {
            id: 2,
            name: 'Node 2',
          },
          {
            id: 3,
            name: 'Node 3',
          },
        ],
      },
    ]);
  });
});
