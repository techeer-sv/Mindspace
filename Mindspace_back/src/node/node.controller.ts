import { Controller, Get, Headers } from '@nestjs/common';
import { NodeService } from './node.service';
import { Node } from './entities/node.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {NodeInfoResponse} from "./dto/node-info-response.dto";
import {NodeResponseDto} from "./dto/node-response.dto";

@ApiTags('Node')
@Controller('api/v1/node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @ApiOperation({ summary: '전체 노드 조회' })
  @Get('all')
  async getAllNode(): Promise<NodeResponseDto[]> {
    return this.nodeService.getAllNode();
  }

  @Get('check')
  async getNodeInfoWithLinks(@Headers('authorization') userId: number): Promise<NodeInfoResponse> {
    const nodeInfo = await this.nodeService.getNodeInfoWithLinks(userId);
    return nodeInfo;
  }

}
