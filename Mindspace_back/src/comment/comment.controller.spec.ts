import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { PaginatedCommentResponseDto } from './dto/comment-pagination-response.dto';
import { CommentResponseDto } from './dto/comment-response.dto';

describe('CommentController', () => {
  let controller: CommentController;
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
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

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  /** 댓글 생성 */
  describe('createComment', () => {
    it('should create a comment', async () => {
      const boardId = 1;
      const userId = '1';
      const createCommentDto = { content: 'Test Comment' };
      const parentId = 2;

      jest
        .spyOn(service, 'createComment')
        .mockImplementation(async () => undefined);

      await controller.createComment(
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
    });
  });

  /** 댓글 목록 조회 */
  describe('getCommentsByBoardId', () => {
    it('should return comments', async () => {
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

      const result = await controller.getComments(
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

  /** 댓글 수정 */
  describe('updateComment', () => {
    it('should update a comment', async () => {
      const commentId = 1;
      const userId = '1';
      const updateCommentDto = { content: '댓글 수정' };
      const mockUpdatedComment: CommentResponseDto = {
        id: 1,
        userNickname: 'user1',
        content: 'Update Content',
        updatedAt: '3분전',
        editable: true,
        replies: [],
      };

      jest
        .spyOn(service, 'updateComment')
        .mockResolvedValue(mockUpdatedComment);

      const result = await controller.updateComment(
        commentId,
        userId,
        updateCommentDto,
      );

      expect(service.updateComment).toHaveBeenCalledWith(
        commentId,
        userId,
        updateCommentDto,
      );
      expect(result).toEqual(mockUpdatedComment);
    });
  });

  /** 댓글 삭제 */
  describe('deleteComment', () => {
    it('should delete a comment', async () => {
      const commentId = 1;
      const userId = '1';

      jest.spyOn(service, 'deleteComment').mockResolvedValue(undefined);

      await controller.deleteComment(commentId, userId);

      expect(service.deleteComment).toHaveBeenCalledWith(commentId, userId);
    });
  });
});
