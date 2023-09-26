//여기에는 응답할때 필수 응답들 모아두는 곳
//게시물 수정 dto
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBoardDto {
  @ApiProperty({ description: 'Title of the board', example: 'Sample Title' })
  title: string;

  @ApiProperty({
    description: 'Content of the board',
    example: 'This is a sample content.',
  })
  content: string;
}
