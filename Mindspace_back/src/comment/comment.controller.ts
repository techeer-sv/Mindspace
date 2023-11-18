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
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PagingParams } from '../global/common/type';
import { PaginatedCommentResponseDto } from './dto/comment-pagination-response.dto';
import { CommentMapper } from './dto/comment.mapper.dto';
import { PutCommentDto } from './dto/put-comment.dto';
import { BoardIdDto } from '../common/dto/board-id.dto';
import { UserIdDto } from '../common/dto/user-id.dto';
import { CommentIdDto } from './dto/commnet-id.dto';
import { CursorPaginationDto } from '../common/dto/cursor-pagination.dto';

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private readonly commentMapper: CommentMapper,
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
    @Query() boardIdDto: BoardIdDto,
    @Headers() userIdDto: UserIdDto,
    @Body() createCommentDto: CreateCommentDto,
    @Query() commentIdDto?: CommentIdDto,
  ): Promise<{ message: string }> {
    await this.commentService.createComment(
      boardIdDto.board_id,
      userIdDto.user_id,
      createCommentDto,
      commentIdDto.comment_id,
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
    @Query() boardIdDto: BoardIdDto,
    @Headers() userIdDto: UserIdDto,
    @Query() pagingParams: CursorPaginationDto,
  ): Promise<PaginatedCommentResponseDto> {
    return await this.commentService.getCommentsByBoardId(
      boardIdDto.board_id,
      userIdDto.user_id,
      pagingParams,
    );
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
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
    @Headers() userIdDto: UserIdDto,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<PutCommentDto> {
    return await this.commentService.updateComment(
      commentIdDto.comment_id,
      userIdDto.user_id,
      updateCommentDto,
    );
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID' })
  @ApiParam({
    name: 'comment_id',
    type: 'number',
    description: '댓글의 ID',
  })
  @Delete(':comment_id')
  async deleteComment(
    @Param() commentIdDto: CommentIdDto,
    @Headers() userIdDto: UserIdDto,
  ): Promise<void> {
    return await this.commentService.deleteComment(
      commentIdDto.comment_id,
      userIdDto.user_id,
    );
  }
}
