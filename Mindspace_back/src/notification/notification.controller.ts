import {
  Controller,
  Get,
  Delete,
  Param,
  Headers,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResponseDTO } from './dto/notification-response.dto';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BoardService } from '../board/board.service';

@ApiTags('notification')
@Controller('api/v1/notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly boardService: BoardService,
  ) {}

  @Get('longpoll/new')
  @ApiOperation({ summary: '새로운 알림 대기' })
  @ApiResponse({
    status: 200,
    description: '새로운 알림이 성공적으로 반환되었습니다.',
    type: NotificationResponseDTO,
  })
  @ApiResponse({ status: 404, description: '사용자를 찾을 수 없습니다.' })
  @ApiHeader({
    name: 'user_id',
    required: true,
    description: '사용자 ID',
  })
  async waitForNewNotifications(
    @Headers('user_id') userIdHeader: string,
  ): Promise<NotificationResponseDTO> {
    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('userId must be a number');
    }
    const notification = await this.notificationService.waitForNewNotifications(
      userId,
    );
    return new NotificationResponseDTO(
      notification.message,
      notification.board.id,
      notification.node.id,
      notification.id,
    );
  }
  @Get()
  @ApiOperation({ summary: '사용자의 모든 알림 가져오기' })
  @ApiResponse({
    status: 200,
    description: '알림 목록이 성공적으로 반환되었습니다.',
    type: NotificationResponseDTO,
    isArray: true,
  })
  @ApiHeader({
    name: 'user_id',
    required: true,
    description: '사용자 ID',
  })
  async getNotifications(
    @Headers('user_id') userIdHeader: string,
  ): Promise<any[]> {
    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      throw new BadRequestException('userId must be a number');
    }

    const notifications =
      await this.notificationService.getNotificationsForUser(userId);

    return notifications.map((notification) => ({
      message: notification.message,
      board_id: notification.board?.id,
      node_id: notification.node?.id,
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
