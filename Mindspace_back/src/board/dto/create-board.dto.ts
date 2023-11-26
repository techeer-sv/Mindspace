import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBoardDto {
  @ApiProperty({ description: '게시글의 제목', example: 'Sample Title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '게시글의 내용',
    example: 'This is a sample content.',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
