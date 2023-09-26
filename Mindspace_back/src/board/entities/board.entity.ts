import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity'; // User 엔터티 임포트
//swagger에서 본문 바디 얘사에 안 나오게 하고 싶으면 @ApiProperty를 지우면 안나옴

@Entity('boards')
export class Board {
  @PrimaryGeneratedColumn('increment', { name: 'board_id' })
  @ApiProperty({ description: '게시글의 ID.' })
  id: number;

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

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  @ApiProperty({ description: '게시글의 마지막 업데이트 시간.' })
  updatedAt: Date;
}
