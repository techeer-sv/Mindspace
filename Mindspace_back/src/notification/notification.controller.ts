import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResponseDTO } from './dto/notification-response.dto';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BoardService } from '../board/board.service';
import { Notification } from './entities/notification.entity';

@ApiTags('notification')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly boardService: BoardService,
  ) {}

  @Get('longpoll/new/:userId')
  @ApiOperation({ summary: '새로운 알림 대기' })
  @ApiResponse({
    status: 200,
    description: '새로운 알림이 성공적으로 반환되었습니다.',
    type: NotificationResponseDTO,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiParam({
    name: 'userId',
    required: true,
    type: 'integer',
    description: '사용자 ID',
  })
  async waitForNewNotifications(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<NotificationResponseDTO> {
    const notification = await this.notificationService.waitForNewNotifications(
      userId,
    );
    return new NotificationResponseDTO(
      notification.message,
      notification.board.id,
      notification.nodeId,
      notification.id,
    );
  }

  @Get(':userId')
  @ApiOperation({ summary: '사용자의 모든 알림 가져오기' })
  @ApiResponse({
    status: 200,
    description: '알림 목록이 성공적으로 반환되었습니다.',
    type: NotificationResponseDTO,
    isArray: true,
  })
  async ggetNotifications(@Param('userId') userId: number): Promise<any[]> {
    const notifications =
      await this.notificationService.ggetNotificationsForUser(userId);

    return notifications.map((notification) => ({
      message: notification.message,
      board_id: notification.board.id,
      node_id: notification.nodeId,
      notification_id: notification.id,
    }));
  }

  @Delete(':notificationId')
  @ApiOperation({ summary: '알림 삭제' })
  @ApiResponse({
    status: 200,
    description: '성공적으로 알림이 삭제되었습니다.',
  })
  @ApiResponse({ status: 404, description: '알림을 찾을 수 없습니다.' })
  async deleteNotification(
    @Param('notificationId') notificationId: number,
  ): Promise<{ message: string }> {
    await this.notificationService.deleteNotification(notificationId);
    return { message: '성공적으로 알림이 삭제되었습니다.' };
  }
}
