import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { BoardMapper } from './dto/board.mapper.dto';
import { UserModule } from '../user/user.module';
import { NodeModule } from '../node/node.module';  // Import NodeModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    UserModule,
    NodeModule,  // Add NodeModule to the imports array
  ],
  providers: [BoardService, BoardMapper],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
