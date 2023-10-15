import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timestamp } from '../../global/common/timeStamp';
import { Board } from '../../board/entities/board.entity';

@Entity()
export class Node extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'node_id' })
  id: number;

  @Column({ name: 'node_name', type: 'varchar', nullable: false })
  name: string;

  @OneToMany(() => Board, (board) => board.node)
  boards: Board[];
}
