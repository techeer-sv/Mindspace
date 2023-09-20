import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('boards')
export class Board {
    @PrimaryGeneratedColumn()
    @ApiProperty({ description: 'The unique identifier of a board.' })
    id: number;

    @Column()
    @ApiProperty({ description: 'Nickname of the user who created the board.' })
    userNickname: string;

    @Column()
    @ApiProperty({ description: 'Title of the board.' })
    title: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    @ApiProperty({ description: 'Last updated time of the board.' })
    updatedAt: Date;
}
