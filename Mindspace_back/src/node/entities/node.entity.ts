import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Node {

    @PrimaryGeneratedColumn('increment', { name: 'node_id' })
    id: number;

    @Column({ name: 'node_name', type: 'varchar', nullable: false })
    name: string;

}