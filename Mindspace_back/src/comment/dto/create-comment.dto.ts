import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({ description: '댓글 내용', example: '댓글 작성' })
  @IsNotEmpty()
  @IsString()
  content: string;
}
