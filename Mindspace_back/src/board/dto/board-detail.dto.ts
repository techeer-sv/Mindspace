// board-detail.dto.ts
//다른 사람의 특정 노드 게시물 조회 dto
import { ApiProperty } from '@nestjs/swagger';

export class BoardDetailDto {
    @ApiProperty({ description: '게시글의 ID' })
    id: number;

    @ApiProperty({ description: '사용자 닉네임' })
    userNickname: string;

    @ApiProperty({ description: '게시글의 제목' })
    title: string;

    @ApiProperty({ description: '게시글의 내용' })
    content: string;

    @ApiProperty({ description: '게시글의 마지막 업데이트 시간' })
    updatedAt: Date;
}
