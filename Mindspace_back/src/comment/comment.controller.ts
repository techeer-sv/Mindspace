import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
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
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PaginatedCommentResponseDto } from './dto/comment-pagination-response.dto';
import { PutCommentDto } from './dto/put-comment.dto';
import { BoardIdDto } from '../common/dto/board-id.dto';
import { CommentIdDto } from './dto/commnet-id.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';
import { UserHeader } from '../common/customDecorator/user-header.decorator';

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 또는 대댓글 생성' })
  @ApiQuery({ name: 'board_id', description: '댓글을 작성할 게시글의 ID' })
  @ApiQuery({
    name: 'comment_id',
    required: false,
    description: '대댓글을 작성할 부모의 ID',
  })
  @ApiHeader({ name: 'user_id', description: '사용자 ID', required: true })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Query() boardIdDto: BoardIdDto,
    @UserHeader('user_id') userId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Query() commentIdDto?: CommentIdDto,
  ): Promise<{ message: string }> {
    await this.commentService.createComment(
      boardIdDto.board_id,
      userId,
      createCommentDto,
      commentIdDto.comment_id,
    );
    return { message: '댓글이 성공적으로 작성되었습니다.' };
  }

  @ApiOperation({ summary: '댓글 조회' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID', required: true })
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
    @Query() boardIdDto: BoardIdDto,
    @UserHeader('user_id') userId: string,
    @Query() pagingParams: CursorPaginationDto,
  ): Promise<PaginatedCommentResponseDto> {
    return await this.commentService.getCommentsByBoardId(
      boardIdDto.board_id,
      userId,
      pagingParams,
    );
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID', required: true })
  @ApiParam({
    name: 'comment_id',
    type: 'number',
    description: '댓글의 ID',
  })
  @ApiCreatedResponse({
    description: '댓글 수정 성공',
  })
  @Put(':comment_id')
  async updateComment(
    @Param() commentIdDto: CommentIdDto,
    @UserHeader('user_id') userId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<PutCommentDto> {
    return await this.commentService.updateComment(
      commentIdDto.comment_id,
      userId,
      updateCommentDto,
    );
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID', required: true })
  @ApiParam({
    name: 'comment_id',
    type: 'number',
    description: '댓글의 ID',
  })
  @Delete(':comment_id')
  async deleteComment(
    @Param() commentIdDto: CommentIdDto,
    @UserHeader('user_id') userId: string,
  ): Promise<void> {
    return await this.commentService.deleteComment(
      commentIdDto.comment_id,
      userId,
    );
  }
}
