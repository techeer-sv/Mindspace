import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Board } from '../../board/entities/board.entity';
import { Node } from '../../node/entities/node.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('increment', { name: 'notification_id' })
  id: number;

  @Column()
  message: string;

  @ManyToOne(() => Node)
  @JoinColumn({ name: 'node_id' })
  @ApiProperty({ description: '게시글과 연관된 노드', type: () => Node })
  node: Node;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '게시글을 작성한 사용자' })
  user: User;

  @ManyToOne(() => Board, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
