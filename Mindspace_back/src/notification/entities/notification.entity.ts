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
  userId: number;

  @Column({ type: 'boolean', nullable: true })
  isRead: boolean;

  @ManyToOne(() => Board, { eager: true }) // eager를 true로 설정하여 자동으로 관련된 Board 정보를 가져올 수 있게 합니다.
  @JoinColumn({ name: 'board_id' })
  board: Board;

  get userNickname(): string {
    return this.board.user.nickname; // board 객체를 통해 user의 nickname을 가져옵니다. 이때 board의 user 객체는 eager 로딩되어 있어야 합니다.
  }
}
