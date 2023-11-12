// 노드별 모든 게시글 조회 dto
import { ApiProperty } from '@nestjs/swagger';

export class BoardNodeResponseDto {
  @ApiProperty({ description: '게시글의 ID.' })
  id: number;

  @ApiProperty({ description: '게시글을 작성한 사용자의 닉네임.' })
  userNickname: string;

  @ApiProperty({ description: '게시글의 제목.' })
  title: string;

  // `content` 프로퍼티 제거

  @ApiProperty({ description: '게시글의 마지막 업데이트 시간.' })
  updatedAt: Date;
}
