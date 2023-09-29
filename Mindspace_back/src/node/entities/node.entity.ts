import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamp } from '../../global/common/timeStamp';

@Entity()
export class Node extends Timestamp {
  @PrimaryGeneratedColumn('increment', { name: 'node_id' })
  id: number;

  @Column({ name: 'node_name', type: 'varchar', nullable: false })
  name: string;
}
