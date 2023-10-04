import { Controller, Get } from '@nestjs/common';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Node')
@Controller('api/v1/node')
export class NodeController {
    constructor(private readonly nodeService: NodeService) {}

    @ApiOperation({ summary: '전체 노드 조회' })
    @Get()
    async getAllNode(): Promise<Node[]> {
        return this.nodeService.getAllNode();
    }
}