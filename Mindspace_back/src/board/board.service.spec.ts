import { Test, TestingModule } from '@nestjs/testing';
import { BoardService } from './board.service';
import { CustomBoardRepository } from './repository/board.repository';
import { PaginatedBoardResponseDto } from './dto/board-pagination-response.dto';
import { BoardResponseDto } from './dto/board-response.dto';
import { BoardController } from './board.controller';
import { ContentNullException } from './exception/ContentNullException';
import { TitleNullException } from './exception/TitleNullException';
import { NodeNotFoundException } from './exception/NodeNotFoundException';
import { NodeAlreadyWrittenException } from './exception/NodeAlreadyWrittenException';
import { BoardNotFoundException } from './exception/BoardNotFoundException';
import { InvalidPostDeleteException } from './exception/InvalidPostDeleteException';

describe('BoardService', () => {
  let service: BoardService;
  let customBoardRepository: CustomBoardRepository;
  let controller: BoardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      exports: [BoardService],
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

    service = module.get<BoardService>(BoardService);
  });
  it('노드 ID로 페이지네이션 게시물 데이터를 반환해야 함', async () => {
    const nodeId = 1;
    const afterCursor = 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg';
    const beforeCursor = null;
    const mockResponse: PaginatedBoardResponseDto = {
      data: [
        {
          id: 1,
          userNickname: 'user1',
          title: 'Title1',
          updatedAt: new Date('2023-11-17T08:48:28.077Z'),
        },
      ],
      cursor: {
        count: 10,
        afterCursor: afterCursor,
        beforeCursor: beforeCursor,
      },
    };

    //게시글 목록 조회 + 페이지네이션 테스트
    jest.spyOn(service, 'getAllBoardsByNodeId').mockResolvedValue(mockResponse);

    const result: PaginatedBoardResponseDto =
      await service.getAllBoardsByNodeId(nodeId, {
        afterCursor,
        beforeCursor,
      });
    expect(service.getAllBoardsByNodeId).toHaveBeenCalledWith(nodeId, {
      afterCursor,
      beforeCursor,
    });
    expect(result).toEqual(mockResponse);
  });

  //게시물 생성 테스트
  describe('ceateBorad', () => {
    it('새로운 개시물을 생성하고 생성된 게시물 데이터를 반환해줘야 함', async () => {
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

      const result = await service.createBoard(nodeId, userId, createBoardDto);

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

      // 'createBoard' 메서드가 'ContentNullException'을 던지도록 모의 구현
      jest.spyOn(service, 'createBoard').mockImplementation(async () => {
        throw new ContentNullException();
      });

      // 'createBoard' 메서드를 호출했을 때 'ContentNullException'이 발생하는지 검증
      await expect(
        service.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrow(ContentNullException);
    });

    it('제목이 없는 경우 TitleNullException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const createBoardDto = { title: '', content: 'Some content' };

      jest.spyOn(service, 'createBoard').mockImplementation(async () => {
        throw new TitleNullException();
      });

      await expect(
        service.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrow(TitleNullException);
    });

    it('해당 노드를 찾을 수 없을 때 NodeNotFoundException을 던져야 함', async () => {
      const nodeId = 999;
      const userId = '123';
      const createBoardDto = { title: 'New Title', content: 'New Content' };

      jest.spyOn(service, 'createBoard').mockImplementationOnce(async () => {
        throw new NodeNotFoundException();
      });

      await expect(
        service.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrowError(NodeNotFoundException);
    });

    it('이미 작성된 노드에 대한 작성 요청인 경우 NodeAlreadyWrittenException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const createBoardDto = { title: 'New Title', content: 'New Content' };

      jest.spyOn(service, 'createBoard').mockImplementation(async () => {
        throw new NodeAlreadyWrittenException();
      });

      await expect(
        service.createBoard(nodeId, userId, createBoardDto),
      ).rejects.toThrow(NodeAlreadyWrittenException);
    });
  });

  //게시글 업데이트 테스트
  describe('updateBoard', () => {
    it('게시글으 수정하고 수정된 게시글 데이터를 반환해야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const updateBoardDto = {
        title: 'Update Title',
        content: 'Updated Content',
      };
      const mockBoardResponse: BoardResponseDto = {
        id: 1,
        userNickname: 'user1',
        title: 'Update Title',
        content: 'Update Content',
        updatedAt: new Date('2023-11-17T08:48:28.077Z'),
      };

      jest.spyOn(service, 'updateBoard').mockResolvedValue(mockBoardResponse);

      const result = await service.updateBoard(nodeId, userId, updateBoardDto);

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

      jest.spyOn(service, 'updateBoard').mockImplementation(async () => {
        throw new ContentNullException();
      });

      await expect(
        service.updateBoard(nodeId, userId, updateBoardDto),
      ).rejects.toThrow(ContentNullException);
    });

    it('제목이 없는 경우 TitleNullException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const UpdateBoardDto = { title: '', content: 'Some content' };

      jest.spyOn(service, 'updateBoard').mockImplementation(async () => {
        throw new TitleNullException();
      });

      await expect(
        service.updateBoard(nodeId, userId, UpdateBoardDto),
      ).rejects.toThrow(TitleNullException);
    });

    it('해당 노드를 찾을 수 없을 때 NodeNotFoundException을 던져야 함', async () => {
      const nodeId = 999;
      const userId = '123';
      const UpdateBoardDto = {
        title: 'New Title',
        content: 'New Content',
      };

      jest.spyOn(service, 'updateBoard').mockImplementationOnce(async () => {
        throw new NodeNotFoundException();
      });

      await expect(
        service.updateBoard(nodeId, userId, UpdateBoardDto),
      ).rejects.toThrowError(NodeNotFoundException);
    });

    it('해당 게시물을 찾을 수 없을 때 BoardNotFoundException을 던져야 함', async () => {
      const nodeId = 1;
      const userId = '123';
      const UpdateBoardDto = {
        title: 'New Title',
        content: 'New Content',
      };

      jest.spyOn(service, 'updateBoard').mockImplementationOnce(async () => {
        throw new BoardNotFoundException();
      });

      await expect(
        service.updateBoard(nodeId, userId, UpdateBoardDto),
      ).rejects.toThrowError(BoardNotFoundException);
    });
  });

  //게시글 삭제 테스트
  describe('deleteOwnBoard', () => {
    it('게시글 삭제 시 해당 게시글을 성공적으로 삭제해야 함', async () => {
      const nodeId = 1;
      const userId = '123';

      jest.spyOn(service, 'deleteOwnBoard').mockResolvedValue(undefined);

      await service.deleteOwnBoard(nodeId, userId);

      expect(service.deleteOwnBoard).toHaveBeenCalledWith(nodeId, userId);
    });

    it('해당 게시판을 찾을 수 없을 때 BoardNotFoundException을 던져줘야 함', async () => {
      const nodeId = 1;
      const userId = '123';

      jest.spyOn(service, 'deleteOwnBoard').mockImplementationOnce(async () => {
        throw new InvalidPostDeleteException();
      });

      await expect(service.deleteOwnBoard(nodeId, userId)).rejects.toThrowError(
        InvalidPostDeleteException,
      );
    });
  });

  //이미지 업로드 테스트
  describe('saveImage', () => {
    it('이미지 업로드 시 URL을 반환해야 함', async () => {
      const mockFile: Express.Multer.File = {
        originalname: 'test.jng',
      } as any;

      const mockResponse = {
        imageUrl: 'http://some-s3-url.com/test.jpg',
      };

      jest.spyOn(service, 'imageUpload').mockResolvedValue(mockResponse);

      const result = await service.imageUpload(mockFile);

      expect(service.imageUpload).toHaveBeenCalledWith(mockFile);
      expect(result).toEqual(mockResponse);
    });
  });
});
