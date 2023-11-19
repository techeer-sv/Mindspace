import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationResponseDTO } from './dto/notification-response.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { nodeId } from 'nest-neo4j/dist/test';
import { Board } from '../board/entities/board.entity';
import { id } from 'date-fns/locale';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            waitForNewNotifications: jest.fn(),
            getNotifications: jest.fn(),
            getNotificationsForUser: jest.fn(),
            deleteNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  describe('waitForNewNotifications', () => {
    it('새로운 알림 대기', async () => {
      const userId = '1';
      const mockNotification = new Notification();
      mockNotification.id = 4;
      mockNotification.nodeId = 2;
      mockNotification.user_id = 1;
      mockNotification.message = 'New Notification';
      mockNotification.board = new Board();
      mockNotification.board.id = 3;
      mockNotification.board.nodeId = 1;
      mockNotification.board.userId = 2;
      mockNotification.board.userNickname = 'MockUser';
      mockNotification.board.title = 'MockTitle';
      mockNotification.board.content = 'MockContent';

      jest
        .spyOn(service, 'waitForNewNotifications')
        .mockResolvedValue(mockNotification);

      const result = await controller.waitForNewNotifications(userId);

      expect(result).toBeInstanceOf(NotificationResponseDTO);
      expect(result.message).toEqual(mockNotification.message);
      expect(result.board_id).toEqual(mockNotification.board.id);
      expect(result.node_id).toEqual(mockNotification.nodeId);
      expect(result.notification_id).toEqual(mockNotification.id);
    });
  });

  describe('getNotifications', () => {
    it('사용자의 모든 알림 가져오기', async () => {
      const userId = '1';
      const user_id = parseInt(userId);

      const mockNotifications = [
        {
          id: 2,
          message: 'user님이 Sample Title에 댓글을 작성했습니다.',
          nodeId: 1,
          user_id: 1,
          board: new Board(), // 이 부분은 Board 엔티티
        },
        {
          id: 1,
          message: 'user님이 Sample Title에 댓글을 작성했습니다.',
          nodeId: 1,
          user_id: 1,
          board: new Board(),
        },
      ];

      jest
        .spyOn(service, 'getNotificationsForUser')
        .mockResolvedValue(mockNotifications);

      const result = await controller.getNotifications(userId);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(mockNotifications.length);
      result.forEach((res, index) => {
        expect(res).toEqual({
          message: mockNotifications[index].message,
          board_id: mockNotifications[index].board.id,
          node_id: mockNotifications[index].nodeId,
          notification_id: mockNotifications[index].id,
        });
      });
    });

    it('잘못된 사용자 ID로 요청 시 BadRequestException을 던진다', async () => {
      const invalidUserId = 'abc';
      await expect(controller.getNotifications(invalidUserId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('deleteNotification', () => {
    it('알림 삭제', async () => {
      const notificationId = 1;
      jest.spyOn(service, 'deleteNotification').mockResolvedValue();

      const result = await controller.deleteNotification(notificationId);
      expect(result).toEqual({ message: '성공적으로 알림이 삭제되었습니다.' });
    });

    it('삭제할 알림을 찾을 수 없을 때 NotFoundException을 던진다', async () => {
      const notificationId = 999;
      jest
        .spyOn(service, 'deleteNotification')
        .mockRejectedValue(new NotFoundException());

      await expect(
        controller.deleteNotification(notificationId),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
