import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Node } from '../../node/entities/node.entity';
import { User } from '../../user/entities/user.entity';
import { Timestamp } from '../../global/common/timeStamp';
import { Node } from '../../node/entities/node.entity';

@Entity('boards')
export class Board extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'board_id' })
  @ApiProperty({ description: '게시글의 ID.' })
  id: number;

  @ManyToOne(() => Node, (node) => node.boards, { eager: true })
  @JoinColumn({ name: 'node_id' })
  node: Node;

  @Column({ name: 'node_id', type: 'int', nullable: false })
  nodeId: number;

  @Column({ name: 'user_nickname', type: 'varchar', nullable: false })
  @ApiProperty({ description: '게시글을 작성한 사용자의 닉네임.' })
  userNickname: string;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  @ApiProperty({ description: '게시글의 제목.' })
  title: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  @ApiProperty({ description: '게시글의 내용.' })
  content: string;

  @ManyToOne(() => User) // User 엔터티를 참조하는 ManyToOne 관계 설정
  @JoinColumn({ name: 'user_id' }) // 외래 키 컬럼 설정
  user: User; // User 엔터티 타입의 프로퍼티 추가

  @Column({ name: 'user_id', type: 'int', nullable: false })
  userId: number;
}
