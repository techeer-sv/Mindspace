import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Board } from '../../board/entities/board.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('increment', { name: 'notification_id' })
  id: number;

  @Column()
  message: string;

  @Column({ type: 'int', nullable: true })
  nodeId: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  // eager를 true로 설정하여 자동으로 관련된 Board 정보를 가져올 수 있게 합니다.
  // TODO: 삭제된 게시글일 경우에는 "삭제된 게시글"로 수정
  @ManyToOne(() => Board, { eager: true })
  @JoinColumn({ name: 'board_id' })
  board: Board;
}
