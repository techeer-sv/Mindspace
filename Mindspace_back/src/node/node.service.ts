import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import {Neo4jNodeRepository} from "./neo4jNode.repository";
import {NodeResponseDto} from "./dto/node-response.dto";
import {NodeMapper} from "./dto/node.mapper";
import {NodeInfoResponse} from "./dto/node-info-response.dto";
import {Board} from "../board/entities/board.entity";
import {nodeBoardRepository} from "./nodeBoard.repository";
import {Neo4jNode} from "./entities/neo4jNode.entity";

@Injectable()
export class NodeService {
    constructor(
        @InjectRepository(Node)
            private readonly nodeRepository: Repository<Node>,
        @InjectRepository(Board)
            private readonly nodeBoardRespository: nodeBoardRepository,
        @InjectRepository(Neo4jNode)
            private readonly neo4jNodeRepository: Neo4jNodeRepository,
            private readonly nodeMapper: NodeMapper
    ) {}

    async getAllNode(): Promise<NodeResponseDto[]> {
        const nodes = await this.nodeRepository.find();
        return nodes.map(node => this.nodeMapper.DtoFromEntity(node));
    }

    async getNodeInfoWithLinks(userId: number): Promise<NodeInfoResponse> {
        const nodes = await this.nodeBoardRespository.getNodeListWithWriteStatus(userId);
        const links = await this.neo4jNodeRepository.findAllLinks();

        // connectCount 계산 및 추가
        const connectCounts: Map<number, number> = new Map();
        links.forEach((link) => {
            connectCounts.set(link.source, (connectCounts.get(link.source) || 0) + 1);
            connectCounts.set(link.target, (connectCounts.get(link.target) || 0) + 1);
        });

        for (const node of nodes) {
            const nodeId = node.id;
            const count = connectCounts.get(nodeId) || 0;
            node['connectCount'] = count;
        }

        const linkDTOs = links.map((link) => this.nodeMapper.linkToDto(link));

        return {
            nodes,
            links: linkDTOs,
        };

    }

}