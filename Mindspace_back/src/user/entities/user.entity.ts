import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Timestamp } from '../../global/common/timeStamp';

@Entity('user')
export class User extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'user_id' })
  id: number;

  @Column({ name: 'email', type: 'varchar', nullable: false })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password: string;

  @Column({ name: 'nickname', type: 'varchar', nullable: false })
  nickname: string;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}
