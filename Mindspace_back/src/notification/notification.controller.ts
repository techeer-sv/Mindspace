import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResponseDTO } from './dto/notification-response.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from '../board/board.service';

@ApiTags('notification')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly boardService: BoardService,
  ) {}

  @Get('longpoll/:userId')
  async waitForNotification(@Param('userId') userId: number) {
    return await this.notificationService.waitForNewNotifications(userId); // 'waitForNotificationByUserId'를 'waitForNewNotifications'로 변경
  }

  @Delete(':id')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 알림이 삭제되었습니다.',
  })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없습니다.' })
  async delete(@Param('id') id: number): Promise<void> {
    return this.notificationService.deleteNotification(id);
  }
}
