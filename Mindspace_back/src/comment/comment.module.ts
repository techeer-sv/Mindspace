import { Module } from '@nestjs/common';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { CommentMapper } from './dto/comment.mapper.dto';
import { UserModule } from '../user/user.module';
import { BoardModule } from '../board/board.module';
import { CustomCommentRepository } from './repository/comment.repository';
import { NotificationModule } from '../notification/notificaton.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UserModule,
    BoardModule,
    NotificationModule,
  ],
  providers: [CommentService, CommentMapper, CustomCommentRepository],
  controllers: [CommentController],
})
export class CommentModule {}
