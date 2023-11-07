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

@Entity('boards')
export class Board extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'board_id' })
  @ApiProperty({ description: '게시글 ID' })
  id: number;

  @ManyToOne(() => Node)
  @JoinColumn({ name: 'node_id' })
  @ApiProperty({ description: '게시글과 연관된 노드', type: () => Node })
  node: Node;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({ description: '게시글을 작성한 사용자' })
  user: User;

  @Column({ name: 'title', type: 'varchar', nullable: false })
  @ApiProperty({ description: '게시글의 제목' })
  title: string;

  @Column({ name: 'content', type: 'text', nullable: false })
  @ApiProperty({ description: '게시글의 내용' })
  content: string;
}
