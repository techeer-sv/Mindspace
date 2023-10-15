//여기에는 응답할때 필수 응답들 모아두는 곳
//노드별 모든 게시물 조회
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BoardDto {
  @ApiProperty({ description: '제목을 작성해주세요', example: 'Sample Title' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({description: '내용을 작성해주세요', example: 'This is a sample content.'})
  @IsNotEmpty()
  content: string;
}
