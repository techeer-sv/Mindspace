import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timestamp } from '../../global/common/timeStamp';
import { Board } from '../../board/entities/board.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Node extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'node_id' })
  id: number;

  @Column({ name: 'node_name', type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => Board, (board) => board.node)
  @ApiProperty({ description: '노드와 연관된 게시글들', type: () => [Board] })
  boards: Board[];
}
