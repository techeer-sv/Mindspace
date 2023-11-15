import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Timestamp } from '../../global/common/timeStamp';
import { User } from '../../user/entities/user.entity';
import { Board } from '../../board/entities/board.entity';

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

  @ManyToOne(() => Board, { onDelete: 'CASCADE' }) // Board 엔터티를 참조하는 ManyToOne 관계 설정, 외래키 제약 조건 수정
  @JoinColumn({ name: 'board_id' }) // 외래 키 컬럼 설정
  board: Board; // Board 엔터티 타입의 프로퍼티 추가

  @ManyToOne(() => Comment, (comment) => comment.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent)
  children: Comment[];
}
