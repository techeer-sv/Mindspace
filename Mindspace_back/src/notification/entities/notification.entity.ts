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
  // 외래키 제약 조건 수정
  @ManyToOne(() => Board, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'board_id' })
  board: Board;

  get userNickname(): string {
    return this.board.user.nickname; // board 객체를 통해 user의 nickname을 가져옵니다. 이때 board의 user 객체는 eager 로딩되어 있어야 합니다.
  }
}
