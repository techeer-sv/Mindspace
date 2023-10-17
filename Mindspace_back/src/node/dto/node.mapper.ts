import { Injectable } from '@nestjs/common';
import { Node } from '../entities/node.entity';
import { NodeResponseDto } from './node-response.dto';
import { NodeLinkDto } from './node-link.dto';
import { Link } from '../entities/link.entity';

@Injectable()
export class NodeMapper {
  DtoFromEntity(node: Node): NodeResponseDto {
    return {
      id: node.id,
      name: node.name,
    };
  }

  linkToDto(link: Link): NodeLinkDto {
    return {
      source: link.source,
      target: link.target,
    };
  }
}
