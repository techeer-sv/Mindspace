import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  Put,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiHeader, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentResponseDto } from './dto/comment-response.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('Comment')
@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiQuery({ name: 'board_id', description: '댓글을 작성할 노드의 ID' })
  @ApiHeader({ name: 'Authorization', description: '사용자 ID' })
  @Post()
  async createComment(
    @Query('board_id') boardId: number,
    @Headers('Authorization') userIdHeader: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<CreateCommentDto> {
    const userId = userIdHeader; // 문자열로 변환
    return this.commentService.createComment(boardId, userId, createCommentDto);
  }

  @ApiQuery({ name: 'board_id', description: '댓글을 조회할 게시글의 ID' })
  @Get()
  async getComments(
    @Query('board_id') boardId: number,
  ): Promise<CommentResponseDto[]> {
    return await this.commentService.getCommentsByBoardId(boardId);
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<UpdateCommentDto> {
    return await this.commentService.updateComment(commentId, updateCommentDto);
  }
}
