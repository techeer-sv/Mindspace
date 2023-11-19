import { Test, TestingModule } from '@nestjs/testing';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { PaginatedBoardResponseDto } from './dto/board-pagination-response.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { ContentNullException } from './exception/ContentNullException';
import { TitleNullException } from './exception/TitleNullException';
import { NodeAlreadyWrittenException } from './exception/NodeAlreadyWrittenException';
import { NodeNotFoundException } from './exception/NodeNotFoundException';
import { UpdateBoardDto } from './dto/update-board.dto';
import { InvalidPostDeleteException } from './exception/InvalidPostDeleteException';
import { BoardNotFoundException } from './exception/BoardNotFoundException';

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
          updatedAt: new Date('2023-11-17T08:48:28.077Z'),
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
      const nodeId = 1;
      const userId = '123';
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

    it('내용이 없는 경우 ContentNullException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const createBoardDto = { title: 'New Title', content: '' };

      jest.spyOn(service, 'createBoard').mockImplementation(() => {
        throw new ContentNullException();
      });

      await expect(
        controller.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrow(ContentNullException);
    });

    it('제목이 없는 경우 TitleNullException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const createBoardDto = { title: '', content: 'Some content' };

      jest.spyOn(service, 'createBoard').mockImplementation(() => {
        throw new TitleNullException();
      });

      await expect(
        controller.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrow(TitleNullException);
    });

    it('해당 노드를 찾을 수 없을 때 NodeNotFoundException을 던져야 함', async () => {
      const nodeId = 999;
      const userId = '123';
      const createBoardDto = { title: 'New Title', content: 'New Content' };

      jest.spyOn(service, 'createBoard').mockImplementationOnce(() => {
        throw new NodeNotFoundException();
      });

      await expect(
        controller.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrowError(NodeNotFoundException);
    });

    it('이미 작성된 노드에 대한 작성 요청인 경우 NodeAlreadyWrittenException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const createBoardDto = { title: 'New Title', content: 'New Content' };

      jest.spyOn(service, 'createBoard').mockImplementation(() => {
        throw new NodeAlreadyWrittenException();
      });

      await expect(
        controller.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrow(NodeAlreadyWrittenException);
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

    it('내용이 없는 경우 ContentNullException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const updateBoardDto = { title: 'New Title', content: '' };

      jest.spyOn(service, 'updateBoard').mockImplementation(() => {
        throw new ContentNullException();
      });

      await expect(
        controller.updateBoard(nodeId, userId, updateBoardDto),
      ).rejects.toThrow(ContentNullException);
    });

    it('제목이 없는 경우 TitleNullException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const UpdateBoardDto = { title: '', content: 'Some content' };

      jest.spyOn(service, 'updateBoard').mockImplementation(() => {
        throw new TitleNullException();
      });

      await expect(
        controller.updateBoard(nodeId, userId, UpdateBoardDto),
      ).rejects.toThrow(TitleNullException);
    });

    it('해당 노드를 찾을 수 없을 때 NodeNotFoundException을 던져야 함', async () => {
      const nodeId = 999;
      const userId = '123';
      const UpdateBoardDto = {
        title: 'New Title',
        content: 'New Content',
      };

      jest.spyOn(service, 'updateBoard').mockImplementationOnce(() => {
        throw new NodeNotFoundException();
      });

      await expect(
        controller.updateBoard(nodeId, userId, UpdateBoardDto),
      ).rejects.toThrowError(NodeNotFoundException);
    });

    it('해당 게시물을 찾을 수 없을 때 BoardNotFoundException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const UpdateBoardDto = {
        title: 'New Title',
        content: 'New Content',
      };

      jest.spyOn(service, 'updateBoard').mockImplementationOnce(() => {
        throw new BoardNotFoundException();
      });

      await expect(
        controller.updateBoard(nodeId, userId, UpdateBoardDto),
      ).rejects.toThrowError(BoardNotFoundException);
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

    it('해당 게시판을 찾을 수 없을 때 BoardNotFoundException을 던져줘야 함', async () => {
      const nodeId = 1;
      const userId = '123';

      jest.spyOn(service, 'deleteOwnBoard').mockImplementationOnce(() => {
        throw new InvalidPostDeleteException();
      });

      await expect(
        controller.deleteOwnBoard(nodeId, userId),
      ).rejects.toThrowError(InvalidPostDeleteException);
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
