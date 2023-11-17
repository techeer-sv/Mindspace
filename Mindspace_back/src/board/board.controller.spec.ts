import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PaginatedBoardResponseDto } from './dto/board-pagination-response.dto';
import { BoardResponseDto } from './dto/board-response.dto';

describe('BoardController', () => {
  let controller: BoardController;
  let service: BoardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BoardController],
      providers: [
        {
          provide: BoardService,
          useValue: {
            getAllBoardsByNodeId: jest.fn(),
            createBoard: jest.fn(),
            updateBoard: jest.fn(),
            deleteOwnBoard: jest.fn(),
            saveImage: jest.fn(),
            imageUpload: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BoardController>(BoardController);
    service = module.get<BoardService>(BoardService);
  });

  it('노드 ID로 페이지네이션된 게시글 데이터를 반환해야 함', async () => {
    const nodeId = 1;
    const afterCursor = 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg';
    const beforeCursor = null;
    const mockResponse: PaginatedBoardResponseDto = {
      data: [
        {
          id: 1,
          userNickname: 'user1',
          title: 'Title 1',
          updatedAt: new Date('2023-11-17T08:48:28.077Z'), // updatedAt as a Date object
        },
      ],
      cursor: {
        count: 10,
        afterCursor: afterCursor,
        beforeCursor: beforeCursor,
      },
    };

    jest.spyOn(service, 'getAllBoardsByNodeId').mockResolvedValue(mockResponse);

    const result = await controller.getAllBoardsByNodeId(nodeId, {
      afterCursor,
      beforeCursor,
    });

    expect(service.getAllBoardsByNodeId).toHaveBeenCalledWith(nodeId, {
      afterCursor,
      beforeCursor,
    });
    expect(result).toEqual(mockResponse);
  });

  // 게시물 생성 테스트
  describe('createBoard', () => {
    it('새로운 게시글을 생성하고 생성된 게시글 데이터를 반환해야 함', async () => {
      const nodeId = 1; // Example node_id, as a number
      const userId = '123'; // Example user_id, as a string
      const createBoardDto = { title: 'New Title', content: 'New Content' };
      const mockBoardResponse: BoardResponseDto = {
        id: 1,
        userNickname: 'user1',
        title: 'New Title',
        content: 'New Content',
        updatedAt: new Date('2023-11-17T08:48:28.077Z'),
      };

      jest.spyOn(service, 'createBoard').mockResolvedValue(mockBoardResponse);

      const result = await controller.createBoard(
        nodeId,
        userId,
        createBoardDto,
      );

      expect(service.createBoard).toHaveBeenCalledWith(
        nodeId,
        userId,
        createBoardDto,
      );
      expect(result).toEqual(mockBoardResponse);
    });
  });

  // 게시글 업데이트 테스트
  describe('updateBoard', () => {
    it('게시글을 수정하고 수정된 게시글 데이터를 반환해야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const updateBoardDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };
      const mockBoardResponse: BoardResponseDto = {
        id: 1,
        userNickname: 'user1',
        title: 'Updated Title',
        content: 'Updated Content',
        updatedAt: new Date('2023-11-17T08:48:28.077Z'),
      };

      jest.spyOn(service, 'updateBoard').mockResolvedValue(mockBoardResponse);

      const result = await controller.updateBoard(
        nodeId,
        userId,
        updateBoardDto,
      );

      expect(service.updateBoard).toHaveBeenCalledWith(
        nodeId,
        userId,
        updateBoardDto,
      );
      expect(result).toEqual(mockBoardResponse);
    });
  });

  // 게시글 삭제 테스트
  describe('deleteOwnBoard', () => {
    it('게시글 삭제 시 해당 게시글을 성공적으로 삭제해야 함', async () => {
      const nodeId = 1;
      const userId = '123';

      jest.spyOn(service, 'deleteOwnBoard').mockResolvedValue(undefined);

      await controller.deleteOwnBoard(nodeId, userId);

      expect(service.deleteOwnBoard).toHaveBeenCalledWith(nodeId, userId);
    });
  });

  // 이미지 업로드 테스트
  describe('saveImage', () => {
    it('이미지 업로드 시 URL을 반환해야 함', async () => {
      // 모의 파일 객체 생성
      const mockFile: Express.Multer.File = {
        originalname: 'test.jpg',
      } as any;

      // 예상되는 응답
      const mockResponse = {
        imageUrl: 'http://some-s3-url.com/test.jpg',
      };

      // 서비스 메소드 모킹
      jest.spyOn(service, 'imageUpload').mockResolvedValue(mockResponse);

      // 컨트롤러 메소드 실행
      const result = await controller.saveImage(mockFile);

      // 검증
      expect(service.imageUpload).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockResponse);
    });
  });
});
