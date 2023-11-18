import { IsNotEmpty, IsString } from 'class-validator';

export class NodeIdDto {
  @IsString()
  @IsNotEmpty()
  node_id: string;
}
