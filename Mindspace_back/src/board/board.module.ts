import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';
import { Board } from './entities/board.entity';
import { BoardMapper } from './dto/board.mapper.dto';
import { UserModule } from '../user/user.module';
import { NodeModule } from '../node/node.module';  // Import NodeModule
import { UtilsModule } from '../utils/utils.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    UserModule,
    NodeModule,  // Add NodeModule to the imports array
    UtilsModule,
    AwsModule,
  ],
  providers: [BoardService, BoardMapper],
  controllers: [BoardController],
  exports: [BoardService],
})
export class BoardModule {}
