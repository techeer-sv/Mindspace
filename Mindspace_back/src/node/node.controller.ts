import { Controller, Get, Headers } from '@nestjs/common';
import { NodeService } from './node.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { NodeResponseDto } from './dto/node-response.dto';
import { UserIdDto } from '../common/dto/user-id.dto';

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
  @Get('check')
  async getNodeInfoWithLinks(@Headers() userIdDto: UserIdDto): Promise<any[]> {
    return await this.nodeService.getNodeInfoWithLinks(userIdDto.user_id);
  }
}
