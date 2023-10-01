import { Injectable } from "@nestjs/common";
import { Node } from '../entities/node.entity';
import { NodeResponseDto } from "./node-response.dto";

@Injectable()
export class NodeMapper {
    DtoFromEntity(node: Node): NodeResponseDto {
        return {
            id: node.id,
            name: node.name,
        };
    }
}