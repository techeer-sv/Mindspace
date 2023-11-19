import { ApiProperty } from '@nestjs/swagger';
import { CommentSingleResponseDto } from './comment-single-response.dto';

class Cursor {
  @ApiProperty({ example: 10 })
  count: number;

  @ApiProperty({ example: 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg' })
  afterCursor: string | null;

  @ApiProperty({ example: null })
  beforeCursor: string | null;
}

export class PaginatedCommentResponseDto {
  @ApiProperty({ type: [CommentSingleResponseDto] })
  data: CommentSingleResponseDto[];

  @ApiProperty({ type: Cursor })
  cursor: Cursor;
}
