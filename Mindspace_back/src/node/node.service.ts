import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/node.entity';
import { NodeResponseDto } from "./dto/node-response.dto";
import { NodeMapper } from "./dto/node.mapper";

@Injectable()
export class NodeService {
    constructor(
        @InjectRepository(Node)
            private readonly nodeRepository: Repository<Node>,
            private readonly nodeMapper: NodeMapper
    ) {}

    async getAllNode(): Promise<NodeResponseDto[]> {
        const nodes = await this.nodeRepository.find();
        return nodes.map(node => this.nodeMapper.DtoFromEntity(node));
    }

}