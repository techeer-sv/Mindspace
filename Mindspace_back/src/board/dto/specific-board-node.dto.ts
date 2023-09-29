//사용자의 특정 노드 게시글 조회 dto
import { ApiProperty } from '@nestjs/swagger';

export class SpecificBoardNodeDto {
  @ApiProperty({ description: '게시글의 제목' })
  title: string;

  @ApiProperty({ description: '게시글의 내용' })
  content: string;

  @ApiProperty({ description: '게시글의 마지막 업데이트 시간' })
  updatedAt: Date;
}
