import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PaginatedCommentResponseDto } from './dto/comment-pagination-response.dto';
import { CommentSingleResponseDto } from './dto/comment-single-response.dto';
import { CommentResponseDto } from './dto/comment-response-dto';

describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CommentService,
          useValue: {
            createComment: jest.fn(),
            getCommentsByBoardId: jest.fn(),
            updateComment: jest.fn(),
            deleteComment: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  /** 댓글 목록 조회 */
  describe('getCommentsByBoardId', () => {
    it('should return paginated comments for a board', async () => {
      const boardId = 1;
      const userId = '1';
      const pagingParams = { afterCursor: null, beforeCursor: null };
      const mockPaginatedComments: PaginatedCommentResponseDto = {
        data: [
          {
            id: 13,
            userNickname: 'nickname',
            content: '댓글작성',
            updatedAt: '약 1시간 전',
            editable: true,
            replies: [],
          },
          {
            id: 12,
            userNickname: 'nickname',
            content: '댓글작성',
            updatedAt: '약 1시간 전',
            editable: true,
            replies: [],
          },
        ],
        cursor: {
          count: 2,
          afterCursor: null,
          beforeCursor: null,
        },
      };

      jest
        .spyOn(service, 'getCommentsByBoardId')
        .mockResolvedValue(mockPaginatedComments);

      const result = await service.getCommentsByBoardId(
        boardId,
        userId,
        pagingParams,
      );

      expect(service.getCommentsByBoardId).toHaveBeenCalledWith(
        boardId,
        userId,
        pagingParams,
      );
      expect(result).toEqual(mockPaginatedComments);
    });
  });

  /** 댓글 생성 */
  describe('createComment', () => {
    it('should return comments', async () => {
      const boardId = 1;
      const userId = '1';
      const createCommentDto = {
        content: '댓글 작성',
      };
      const parentId = 1;
      const mockCommentResponse: CommentResponseDto = {
        id: 1,
        userNickname: 'user1',
        content: '댓글 작성',
        updatedAt: new Date('2023-11-19T07:25:29.688Z'),
      };

      jest
        .spyOn(service, 'createComment')
        .mockResolvedValue(mockCommentResponse);

      const result = await service.createComment(
        boardId,
        userId,
        createCommentDto,
        parentId,
      );

      expect(service.createComment).toHaveBeenCalledWith(
        boardId,
        userId,
        createCommentDto,
        parentId,
      );
      expect(result).toEqual(mockCommentResponse);
    });
  });

  /** 댓글 수정 */
  describe('updateComment', () => {
    it('should update a comment', async () => {
      const boardId = 1;
      const userId = '1';
      const updateCommentDto = {
        content: '댓글 수정',
      };
      const mockBoardResponse: CommentSingleResponseDto = {
        id: 1,
        userNickname: 'user1',
        content: 'Update Content',
        updatedAt: '3분전',
        editable: true,
        replies: [],
      };

      jest.spyOn(service, 'updateComment').mockResolvedValue(mockBoardResponse);

      const result = await service.updateComment(
        boardId,
        userId,
        updateCommentDto,
      );

      expect(service.updateComment).toHaveBeenCalledWith(
        boardId,
        userId,
        updateCommentDto,
      );
      expect(result).toEqual(mockBoardResponse);
    });
  });

  /** 댓글 삭제 */
  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const commentId = 1;
      const userId = '1';

      jest.spyOn(service, 'deleteComment').mockResolvedValue(undefined);

      await service.deleteComment(commentId, userId);

      expect(service.deleteComment).toHaveBeenCalledWith(commentId, userId);
    });
  });
});
