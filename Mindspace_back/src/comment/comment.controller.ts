import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiHeader, ApiQuery, ApiTags } from '@nestjs/swagger';

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
}
