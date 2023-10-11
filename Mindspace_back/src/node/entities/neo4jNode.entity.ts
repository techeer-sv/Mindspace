// // import { Link } from './link.entity';
// import { Id, Node, Relation } from 'nest-neo4j';
//
// @Node
// export class Neo4jNode {
//     @Id
//     id: number;
//
//     @Relation(() => Link, 'LINKS_TO', { cascade: true })
//     links: Link[];
// }

// import { NodeEntity, PrimaryGeneratedColumn, Relationship } from 'nest-neo4j';
// import { Link } from './link.entity'; // link 엔티티 가져오기
//
// @NodeEntity('Neo4jNode')
// export class Neo4jNode {
//     @PrimaryGeneratedColumn()
//     id: number;
//
//     @Relationship(() => Link, 'HAS_LINK', 'out')
//     link: Link[];
// }

import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Relation } from 'typeorm';
import { Link } from './link.entity';

@Entity()
export class Neo4jNode {
    @PrimaryGeneratedColumn()
    id: number;

    // @OneToMany(() => Link, (link) => link.neo4jNode)
    // @JoinTable()
    // links: Link[];

    // @ManyToOne(() => Link, (link) => link.neo4jNode)
    // @JoinColumn({ name: 'linkId' }) // 이 부분은 해당 엔티티 간 관계의 foreign key 이름을 설정합니다.
    // link: Link;

    // @Relation(() => Link, 'LINKS_TO', { cascade: true })
    // links: Link[];


}
