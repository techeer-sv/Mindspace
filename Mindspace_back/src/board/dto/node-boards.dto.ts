//여기에는 응답할때 필수 응답들 모아두는 곳
//노드별 모든 게시물 조회
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BoardDto {
    @ApiProperty({ description: 'Title of the board', example: 'Sample Title' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Content of the board', example: 'This is a sample content.' })
    @IsNotEmpty()
    content: string;
}
