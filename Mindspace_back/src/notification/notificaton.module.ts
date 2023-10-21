import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { BoardModule } from '../board/board.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    forwardRef(() => BoardModule),
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
  exports: [NotificationService], // 다른 모듈에서 NotificationService를 사용하려면 이를 export해야 합니다.
})
export class NotificationModule {}
