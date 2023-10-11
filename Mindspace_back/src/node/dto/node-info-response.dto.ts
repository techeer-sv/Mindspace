import { ApiProperty } from '@nestjs/swagger';
import { NodeLinkDto } from './node-link.dto';

export class NodeInfoResponse {
    @ApiProperty({ type: [Object] })
    // nodes: Map<string, Object>[];
    nodes: any[];

    @ApiProperty({ type: [NodeLinkDto] })
    links: NodeLinkDto[];
}
