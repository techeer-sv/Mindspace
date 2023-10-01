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
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiHeader, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiOperation({ summary: '댓글 생성' })
  @ApiHeader({ name: 'Authorization', description: '사용자 ID' })
  @Post(':boardId')
  async createComment(
    @Param('boardId') boardId: number,
    @Headers('Authorization') userIdHeader: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    const userId = userIdHeader; // 문자열로 변환
    return this.commentService.createComment(boardId, userId, createCommentDto);
  }

  @ApiOperation({ summary: '댓글 조회' })
  @Get(':boardId')
  async getComments(
    @Param('boardId') boardId: number,
  ): Promise<CommentResponseDto[]> {
    return await this.commentService.getCommentsByBoardId(boardId);
  }

  @ApiOperation({ summary: '댓글 수정' })
  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateCommentDto> {
    return await this.commentService.updateComment(commentId, updateCommentDto);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @Delete(':commentId')
  async deleteComment(@Param('commentId') commentId: number): Promise<void> {
    return await this.commentService.deleteComment(commentId);
  }
}
