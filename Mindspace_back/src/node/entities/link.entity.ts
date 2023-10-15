import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'source' })
  source: number;

  @Column({ name: 'target' })
  target: number;
}
