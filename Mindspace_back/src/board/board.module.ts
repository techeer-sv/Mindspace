import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { BoardMapper } from './dto/board.mapper.dto';
import { UserModule } from '../user/user.module';
import { NodeModule } from '../node/node.module';
import { UtilsModule } from '../utils/utils.module';
import { AwsModule } from '../aws/aws.module';
import { CustomBoardRepository } from './repository/board.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    UserModule,
    NodeModule,
    UtilsModule,
    AwsModule,
  ],
  providers: [BoardService, BoardMapper, CustomBoardRepository],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
