import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Node } from './entities/node.entity';

@Injectable()
export class NodeService {
  constructor(
    @InjectRepository(Node) private readonly nodeRepository: Repository<Node>,
  ) {}

  async getAllNode(): Promise<Node[]> {
    return this.nodeRepository.find();
  }
}
