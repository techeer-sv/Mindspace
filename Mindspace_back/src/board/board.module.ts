import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { BoardMapper } from './dto/board.mapper.dto';
import { UserModule } from '../user/user.module'; // Corrected this import to BoardMapper

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    UserModule, // Add UserModule to the imports array
  ],
  providers: [BoardService, BoardMapper],
  controllers: [BoardController],
})
export class BoardModule {}
