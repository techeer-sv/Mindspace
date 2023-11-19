import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { NoNotificationException } from './exception/NoNotificationException';
import { Board } from '../board/entities/board.entity';
import { NotFoundException } from '@nestjs/common';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: Repository<Notification>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(Notification),
          useClass: Repository,
          useValue: {
            waitForNewNotifications: jest.fn(),
            getNotificationsForUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
  });

  describe('getNotificationsForUser', () => {
    it('사용자에 대한 알림을 반환해야 함', async () => {
      const mockNotifications: Notification[] = [
        {
          id: 2,
          message: 'user님이 Sample Title에 댓글을 작성했습니다.',
          nodeId: 1,
          user_id: 1,
          board: new Board(),
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
        .spyOn(notificationRepository, 'find')
        .mockResolvedValue(mockNotifications);

      const userId = 1; // 실제 사용자 ID
      const result = await service.getNotificationsForUser(userId);

      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(mockNotifications.length);
      result.forEach((res, index) => {
        expect(res).toMatchObject({
          message: mockNotifications[index].message,
          // 이 부분은 NotificationResponseDTO의 구조에 맞게 조정해야 함
        });
      });
    });
  });

  describe('waitForNewNotifications', () => {
    it('TIMEOUT_DURATION 후에 NoNotificationException으로 거부해야 함', async () => {
      jest.useFakeTimers();
      const promise = service.waitForNewNotifications(1);

      jest.advanceTimersByTime(service['TIMEOUT_DURATION']);

      await expect(promise).rejects.toThrow(NoNotificationException);
      jest.useRealTimers();
    });

    it('새 알림이 수신되면 해결되어야 함', async () => {
      jest.useFakeTimers();
      const promise = service.waitForNewNotifications(1);

      // 새 알림을 시뮬레이션하기 위해 서비스의 내부 상태를 변경
      service['waitingClients'][0].resolve(new Notification());

      await expect(promise).resolves.toBeInstanceOf(Notification);
      jest.useRealTimers();
    });
  });

  describe('deleteNotification', () => {
    it('알림을 성공적으로 삭제해야 함', async () => {
      const mockDeleteResult = { affected: 1 } as DeleteResult;
      jest
        .spyOn(notificationRepository, 'delete')
        .mockResolvedValue(mockDeleteResult);

      await expect(service.deleteNotification(1)).resolves.not.toThrow();
    });

    it('알림을 찾을 수 없으면 NotFoundException을 발생시켜야 함', async () => {
      const mockDeleteResult = { affected: 0 } as DeleteResult;
      jest
        .spyOn(notificationRepository, 'delete')
        .mockResolvedValue(mockDeleteResult);

      await expect(service.deleteNotification(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createNotificationForBoardOwner', () => {
    it('게시판 소유자를 위한 알림을 생성해야 함', async () => {
      const mockNotification = new Notification();
      jest
        .spyOn(notificationRepository, 'save')
        .mockResolvedValue(mockNotification);

      const data = {
        board: new Board(),
        message: 'Test message',
        commentId: 123,
        nodeId: 456,
        userId: 1,
      };

      const result = await service.createNotificationForBoardOwner(data);
      expect(result).toEqual(mockNotification);
    });
  });
});
