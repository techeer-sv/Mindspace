import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { BoardModule } from '../board/board.module';
import { User } from '../user/entities/user.entity';
import { Node } from '../node/entities/node.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, Node, User]), // Notification 엔티티를 추가합니다.
    forwardRef(() => BoardModule), // 순환 의존성을 해결합니다.
    // 다른 필요한 모듈들
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
