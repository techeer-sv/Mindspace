// import { PrimaryGeneratedColumn  } from 'typeorm';
// import { RelationshipEntity, Property } from 'nest-neo4j';
//
// @RelationshipEntity(type => 'LINKS_TO')
// export class Link {
//     @PrimaryGeneratedColumn('increment')
//     id: number;
//
//     @Property({ name: 'source' })
//     source: number;
//
//     @Property({ name: 'target' })
//     target: number;
// }
// import { NodeEntity, PrimaryGeneratedColumn, Property } from 'nest-neo4j';
//
// @NodeEntity('Link')
// export class Link {
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Property()
//     source: number;
//
//     @Property()
//     target: number;
// }

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Link {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  source: number;

  @Column()
  target: number;
}
