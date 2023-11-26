import { ApiProperty } from '@nestjs/swagger';
import { BoardNodeResponseDto } from './board-node-response.dto';
import { IsNumber, IsString } from 'class-validator';

class Cursor {
  @ApiProperty({ example: 10 })
  @IsNumber()
  count: number;

  @ApiProperty({ example: 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg' })
  @IsString()
  afterCursor: string;

  @ApiProperty({ example: 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg' })
  @IsString()
  beforeCursor: string;
}

export class PaginatedBoardResponseDto {
  @ApiProperty({ type: [BoardNodeResponseDto] })
  data: BoardNodeResponseDto[];

  @ApiProperty({ type: Cursor })
  cursor: Cursor;
}
