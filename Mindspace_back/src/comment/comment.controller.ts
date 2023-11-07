import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PagingParams } from '../global/common/type';
import { PaginatedCommentResponseDto } from './dto/comment-pagination-response.dto';
import { NotificationService } from '../notification/notification.service';
import { BoardService } from '../board/board.service';

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly notificationService: NotificationService,
    private readonly boardService: BoardService,
  ) {}

  @ApiOperation({ summary: '댓글 또는 대댓글 생성' })
  @ApiQuery({ name: 'board_id', description: '댓글을 작성할 게시글의 ID' })
  @ApiQuery({
    name: 'comment_id',
    required: false,
    description: '대댓글을 작성할 부모의 ID',
  })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Query('board_id') boardId: number,
    @Headers('user_id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Query('comment_id') parentId?: number,
  ): Promise<{ message: string }> {
    await this.commentService.createComment(
      boardId,
      userId,
      createCommentDto,
      parentId,
    );

    return { message: '댓글이 성공적으로 작성되었습니다.' };
  }

  @ApiOperation({ summary: '댓글 조회' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiQuery({ name: 'board_id', description: '댓글을 조회할 게시글의 ID' })
  @ApiQuery({
    name: 'beforeCursor',
    required: false,
    type: String,
    description: '이전 커서 값',
  })
  @ApiQuery({
    name: 'afterCursor',
    required: false,
    type: String,
    description: '다음 커서 값',
  })
  @ApiCreatedResponse({
    description: '댓글 조회 성공',
    type: PaginatedCommentResponseDto,
  })
  @Get()
  async getComments(
    @Query('board_id') boardId: number,
    @Headers('user_id') userId: string,
    @Query() pagingParams: PagingParams,
  ): Promise<PaginatedCommentResponseDto> {
    return await this.commentService.getCommentsByBoardId(
      boardId,
      userId,
      pagingParams,
    );
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiParam({ name: 'commentId', type: 'number', description: '댓글 ID' })
  @ApiCreatedResponse({
    description: '댓글 수정 성공',
    // 여기서 SimpleCommentResponseDto가 아닌 CommentResponseDto 사용 예시로 남겨두었습니다.
  })
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Headers('user_id') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<{ id: number; content: string }> {
    // CommentService에서 수정된 댓글을 반환받습니다.
    return this.commentService.updateComment(
      commentId,
      userId,
      updateCommentDto,
    );
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '게시글의 ID',
  })
  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: number,
    @Headers('user_id') userId: string,
  ): Promise<void> {
    return await this.commentService.deleteComment(commentId, userId);
  }
}
