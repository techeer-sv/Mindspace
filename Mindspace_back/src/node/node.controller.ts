import { Controller, Get, Headers } from '@nestjs/common';
import { NodeService } from './node.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodeResponseDto } from './dto/node-response.dto';

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
  async getNodeInfoWithLinks(
    @Headers('user_id') userId: number,
  ): Promise<any[]> {
    return await this.nodeService.getNodeInfoWithLinks(userId);
  }
}
