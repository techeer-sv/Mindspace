import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BoardIdDto {
  @ApiProperty({ description: '게시글 ID' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  board_id: number;
}
