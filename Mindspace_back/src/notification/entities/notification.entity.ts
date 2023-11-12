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

  @ManyToOne(() => Board, { eager: true }) // eager를 true로 설정하여 자동으로 관련된 Board 정보를 가져올 수 있게 합니다.
  @JoinColumn({ name: 'board_id' })
  board: Board;

  get userNickname(): string {
    return this.board.user.nickname; // board 객체를 통해 user의 nickname을 가져옵니다. 이때 board의 user 객체는 eager 로딩되어 있어야 합니다.
  }
}
