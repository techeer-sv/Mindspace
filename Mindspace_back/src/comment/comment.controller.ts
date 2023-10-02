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
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiQuery({ name: 'board_id', description: '댓글을 작성할 게시글의 ID' })
  @ApiHeader({ name: 'Authorization', description: '사용자 ID' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createComment(
    @Param('board_id') boardId: number,
    @Headers('Authorization') userIdHeader: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<{ message: string }> {
    const userId = userIdHeader;
    await this.commentService.createComment(boardId, userId, createCommentDto);

    return { message: '댓글이 성공적으로 작성되었습니다.' };
  }

  @ApiOperation({ summary: '댓글 조회' })
  @ApiQuery({ name: 'board_id', description: '댓글을 조회할 게시글의 ID' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호(기본값: 1)',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: '페이지 당 댓글 수(기본값: 10)',
  })
  @Get()
  async getComments(
    @Param('board_id') boardId: number,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<CommentResponseDto[]> {
    return await this.commentService.getCommentsByBoardId(
      boardId,
      page,
      pageSize,
    );
  }

  @ApiOperation({ summary: '댓글 수정' })
  @ApiParam({
    name: 'commentId',
    type: 'number',
    description: '게시글의 ID',
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
