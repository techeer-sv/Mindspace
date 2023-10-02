import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Timestamp } from '../../global/common/timeStamp';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('comment')
export class Comment extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'comment_id' })
  @ApiProperty({ description: '댓글 ID' })
  id: number;

  @Column({ name: 'content', type: 'varchar', nullable: false })
  @ApiProperty({ description: '댓글 내용' })
  content: string;

  @ManyToOne(() => User) // User 엔터티를 참조하는 ManyToOne 관계 설정
  @JoinColumn({ name: 'user_id' }) // 외래 키 컬럼 설정
  user: User; // User 엔터티 타입의 프로퍼티 추가

  @Column({ name: 'user_nickname', type: 'varchar', nullable: false })
  @ApiProperty({ description: '댓글을 작성한 사용자의 닉네임.' })
  userNickname: string;

  @ManyToOne(() => Board) // Board 엔터티를 참조하는 ManyToOne 관계 설정
  @JoinColumn({ name: 'board_id' }) // 외래 키 컬럼 설정
  board: Board; // Board 엔터티 타입의 프로퍼티 추가
}
