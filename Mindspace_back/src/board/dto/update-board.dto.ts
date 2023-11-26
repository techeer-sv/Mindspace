import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateBoardDto {
  @ApiProperty({ description: 'Title of the board', example: 'Sample Title' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Content of the board',
    example: 'This is a sample content.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
