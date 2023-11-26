import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Node as NodeEntity } from '../node/entities/node.entity';
import { User } from '../user/entities/user.entity';
import { Board } from '../board/entities/board.entity';
import { NoNotificationException } from './exception/NoNotificationException';
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
          useValue: {
            findOneBy: jest.fn(),
            waitForNewNotifications: jest.fn(),
            getNotificationsForUser: jest.fn(),
            deleteNotification: jest.fn(),
            createNotificationForBoardOwner: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(NodeEntity),
          useValue: mockNodeRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<Repository<Notification>>(
      getRepositoryToken(Notification),
    );
  });

  const mockNodeRepository = {
    findOneBy: jest.fn().mockImplementation((criteria) => {
      if (criteria.id === 456) {
        return Promise.resolve({
          id: 456,
        });
      }
      return Promise.resolve(null);
    }),
  };

  const mockUserRepository = {
    findOneBy: jest.fn().mockImplementation((criteria) => {
      if (criteria.id === 1) {
        return Promise.resolve({
          id: 1,
        });
      }
      return Promise.resolve(null);
    }),
  };

  describe('getNotificationsForUser', () => {
    it('사용자에 대한 알림을 반환해야 함', async () => {
      const userId = 1;
      // 엔티티의 모든 필수 속성을 포함하는 모의 객체를 생성
      const mockNode = { id: 1, name: 'NodeName', boards: [] } as NodeEntity;
      const mockUser = { id: userId } as User;
      const mockBoard = { id: 1 } as Board;

      const mockNotifications: Notification[] = [
        {
          id: 1,
          message: 'user님이 Sample Title에 댓글을 작성했습니다.',
          node: mockNode,
          user: mockUser,
          board: mockBoard,
        },
        // ...다른 mock Notification 객체들...
      ];

      // notificationRepository.find 함수를 모의 구현
      jest
        .spyOn(notificationRepository, 'find')
        .mockResolvedValue(mockNotifications);

      // 서비스 메소드를 호출하여 결과를 가져옵니다.
      const serviceResult = await service.getNotificationsForUser(userId);

      // 결과가 기대한 배열인지 검증합니다.
      expect(serviceResult).toBeInstanceOf(Array);
      expect(serviceResult).toHaveLength(mockNotifications.length);
      serviceResult.forEach((notification, index) => {
        expect(notification).toHaveProperty('id', mockNotifications[index].id);
        expect(notification).toHaveProperty(
          'message',
          mockNotifications[index].message,
        );
        // node, user, board 객체가 포함되어 있는지 확인
        expect(notification.node).toHaveProperty('id', mockNode.id);
        expect(notification.user).toHaveProperty('id', mockUser.id);
        expect(notification.board).toHaveProperty('id', mockBoard.id);
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
