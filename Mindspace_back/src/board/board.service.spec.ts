import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { CustomBoardRepository } from './repository/board.repository';
import { Board } from './entities/board.entity';
import { BoardMapper } from './dto/board.mapper.dto';

describe('BoardService', () => {
  let service: BoardService;
  let customBoardRepository: CustomBoardRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardService,
        {
          provide: CustomBoardRepository,
          useValue: {
            paginate: jest.fn(),
          },
        },
        // ... 다른 필요한 providers
      ],
    }).compile();

    service = module.get<BoardService>(BoardService);
    customBoardRepository = module.get<CustomBoardRepository>(
      CustomBoardRepository,
    );
  });

  describe('getAllBoardsByNodeId', () => {
    it('should return paginated board data', async () => {
      const nodeId = 1;
      const pagingParams = { limit: 10, page: 1 };

      const mockBoardData = [
        // 예시로 Board 엔터티의 인스턴스를 생성. 실제로는 필요한 속성들을 포함해야 함.
        {
          id: 1,
          userNickname: 'user1',
          title: 'Test1',
          content: 'test1',
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          userNickname: 'user2',
          title: 'Post 2',
          content: 'test1',
          updatedAt: new Date().toISOString(),
        },
        // ... 기타 필요한 Board 데이터
      ];

      const mockPaginationResult = {
        data: mockBoardData,
        cursor: {
          beforeCursor: null, // 첫 페이지인 경우 보통 null입니다.
          afterCursor: 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg', // 다음 페이지로의 커서
        },
      };

      jest
        .spyOn(customBoardRepository, 'paginate')
        .mockResolvedValue(mockPaginationResult);

      const result = await service.getAllBoardsByNodeId(nodeId, pagingParams);

      expect(customBoardRepository.paginate).toHaveBeenCalledWith(
        nodeId,
        pagingParams,
      );
      expect(result).toEqual({
        data: mockBoardData.map((board) =>
          BoardMapper.BoardNodeResponseDto(board),
        ),
        cursor: {
          count: mockBoardData.length,
          ...mockPaginationResult.cursor,
        },
      });
    });
  });

  // ... 다른 메소드에 대한 테스트 케이스
});
