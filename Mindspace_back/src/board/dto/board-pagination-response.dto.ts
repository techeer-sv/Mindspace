import { ApiProperty } from '@nestjs/swagger';
import { BoardNodeResponseDto } from './board-node-response.dto';

class Cursor {
    @ApiProperty({ example: 10 })
    count: number;

    @ApiProperty({ example: 'Y3JlYXRlZEF0OjE2OTYzMTg5OTc5Mzg' })
    afterCursor: string | null;

    @ApiProperty({ example: null })
    beforeCursor: string | null;
}

export class PaginatedBoardResponseDto {
    @ApiProperty({ type: [BoardNodeResponseDto] })
    data: BoardNodeResponseDto[];

    @ApiProperty({ type: Cursor })
    cursor: Cursor;
}
