import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class NodeIdDto {
  @ApiProperty({ description: '노드 ID' })
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  node_id: number;
}
