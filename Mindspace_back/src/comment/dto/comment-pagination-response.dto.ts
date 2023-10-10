import { ApiProperty } from '@nestjs/swagger';
import { CommentResponseDto } from './comment-response.dto';

class Cursor {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg' })
  afterCursor: string | null;

  @ApiProperty({ example: null })
  beforeCursor: string | null;
}

export class PaginatedCommentResponseDto {
  @ApiProperty({ type: [CommentResponseDto] })
  data: CommentResponseDto[];

  @ApiProperty({ type: Cursor })
  cursor: Cursor;
}
