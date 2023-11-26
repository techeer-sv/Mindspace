import { Controller, Get } from '@nestjs/common';
import { NodeService } from './node.service';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodeResponseDto } from './dto/node-response.dto';
import { UserHeader } from '../common/customDecorator/user-header.decorator';

@ApiTags('Node')
@Controller('api/v1/node')
export class NodeController {
  constructor(private readonly nodeService: NodeService) {}

  @ApiOperation({ summary: '전체 노드 조회' })
  @Get('all')
  async getAllNode(): Promise<NodeResponseDto[]> {
    return this.nodeService.getAllNode();
  }

  @ApiOperation({ summary: '노드 맵 정보 조회' })
  @ApiHeader({ name: 'user_id', description: '사용자 ID', required: true })
  @Get('check')
  async getNodeInfoWithLinks(
    @UserHeader('user_id') userId: string,
  ): Promise<any[]> {
    return await this.nodeService.getNodeInfoWithLinks(userId);
  }
}
