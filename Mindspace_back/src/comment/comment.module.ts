import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentMapper } from './dto/comment.mapper.dto';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), UserModule, BoardModule],
  providers: [CommentService, CommentMapper],
  controllers: [CommentController],
})
export class CommentModule {}
