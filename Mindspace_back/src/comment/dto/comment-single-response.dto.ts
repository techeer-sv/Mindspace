import { ApiProperty } from '@nestjs/swagger';

export class CommentSingleResponseDto {
  @ApiProperty({ description: '댓글의 ID' })
  id: number;

  @ApiProperty({ description: '댓글을 작성한 사용자의 닉네임' })
  userNickname: string;

  @ApiProperty({ description: '댓글의 내용' })
  content: string;

  @ApiProperty({ description: '댓글의 마지막 업데이트 시간' })
  updatedAt: string;

  @ApiProperty({ description: '본인이 작성한 댓글인지' })
  editable: boolean;

  @ApiProperty({ description: '대댓글 목록' })
  replies?: CommentSingleResponseDto[];
}
