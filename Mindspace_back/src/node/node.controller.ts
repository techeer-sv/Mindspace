import { Controller, Get } from '@nestjs/common';
import { NodeService } from './node.service'; 
import { Node } from './entities/node.entity';

@Controller('api/v1/node')
export class NodeController {
    constructor(private readonly nodeService: NodeService) {}

    @Get()
    async getAllNode(): Promise<Node[]> {
        return this.nodeService.getAllNode();
    }
}
