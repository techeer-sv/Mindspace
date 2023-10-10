import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '댓글 내용', example: '댓글 작성' })
  @IsNotEmpty()
  content: string;
}
