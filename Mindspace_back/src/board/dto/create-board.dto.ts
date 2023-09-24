//게시물 생성 무조건 작성해야 하는 dto
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBoardDto {
    @ApiProperty({ description: '게시글의 제목', example: 'Sample Title' })
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: '게시글의 내용', example: 'This is a sample content.' })
    @IsNotEmpty()
    content: string;
}




