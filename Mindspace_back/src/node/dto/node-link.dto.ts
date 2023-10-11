import { ApiProperty } from '@nestjs/swagger';

export class NodeLinkDto {
    @ApiProperty({ description: 'source', example: 'source11' })
    source: number;

    @ApiProperty({ description: 'target', example: 'target11' })
    target: number;
}
