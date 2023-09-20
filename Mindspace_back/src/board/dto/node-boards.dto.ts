import { ApiProperty } from '@nestjs/swagger';

export class BoardsDTO {
    @ApiProperty({ description: 'The unique identifier of a board.' })
    id: number;

    @ApiProperty({ description: 'Nickname of the user who posted the board.' })
    userNickname: string;

    @ApiProperty({ description: 'Title of the board.' })
    title: string;

    @ApiProperty({ description: 'Last updated time of the board.' })
    updatedAt: Date;
}
