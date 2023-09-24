import {ApiProperty} from "@nestjs/swagger";
//게시글 생성 되고 나면 responsebody에 들어갈 dto
export class BoardResponseDto {
    @ApiProperty({ description: '게시글의 ID.' })
    id: number;

    @ApiProperty({ description: '게시글을 작성한 사용자의 닉네임.' })
    userNickname: string;

    @ApiProperty({ description: '게시글의 제목.' })
    title: string;

    @ApiProperty({ description: '게시글의 내용.' })
    content: string;

    @ApiProperty({ description: '게시글의 마지막 업데이트 시간.' })
    updatedAt: Date;
}

