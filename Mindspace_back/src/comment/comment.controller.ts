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

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiQuery({ name: 'board_id', description: '댓글을 작성할 게시글의 ID' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Query('board_id') boardId: number,
    @Headers('user_id') userIdHeader: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<{ message: string }> {
    const userId = userIdHeader;
    await this.commentService.createComment(boardId, userId, createCommentDto);

    return { message: '댓글이 성공적으로 작성되었습니다.' };
  }

  @ApiOperation({ summary: '댓글 조회' })
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
    @Query() pagingParams: PagingParams,
  ): Promise<PaginatedCommentResponseDto> {
    return await this.commentService.getCommentsByBoardId(
      boardId,
      pagingParams,
    );
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '게시글의 ID',
  })
  @ApiCreatedResponse({
    description: '댓글 수정 성공',
    type: Comment,
  })
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateCommentDto> {
    return await this.commentService.updateComment(commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '게시글의 ID',
  })
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: number): Promise<void> {
    return await this.commentService.deleteComment(commentId);
  }
}