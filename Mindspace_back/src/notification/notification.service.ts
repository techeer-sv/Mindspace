import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Board } from '../board/entities/board.entity';
import { User } from '../user/entities/user.entity';
import { Node } from '../node/entities/node.entity';
import { NoNotificationException } from './exception/NoNotificationException';

@Injectable()
export class NotificationService {
  private readonly TIMEOUT_DURATION = 30000;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public waitingClients: {
    user_id: number;
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    timer: NodeJS.Timeout;
  }[] = [];

  private addToWaitingClients(client: {
    user_id: number;
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    timer: NodeJS.Timeout;
  }) {
    this.waitingClients.push(client);
  }

  async waitForNewNotifications(user_id: number): Promise<Notification> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const index = this.waitingClients.findIndex(
          (client) => client.user_id === user_id,
        );
        if (index !== -1) {
          this.waitingClients.splice(index, 1);
          reject(new NoNotificationException());
        }
      }, this.TIMEOUT_DURATION);

      this.addToWaitingClients({ user_id, resolve, reject, timer });
    });
  }

  async getNotificationsForUser(user_id: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: user_id } },
      relations: ['board', 'node'],
      order: { id: 'DESC' },
    });
  }

  async deleteNotification(id: number): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }

  async createNotificationForBoardOwner(data: {
    board: Board;
    message: string;
    commentId: number;
    nodeId: number; // Node ID
    userId: number; // User ID
  }): Promise<Notification> {
    // 먼저 Node와 User 엔티티를 조회합니다.
    const node = await this.nodeRepository.findOneBy({
      id: data.nodeId,
    } as FindOptionsWhere<Node>);
    const user = await this.userRepository.findOneBy({ id: data.userId });

    // 찾은 Node와 User 엔티티를 검증합니다.
    if (!node) {
      throw new NotFoundException(`Node with ID ${data.nodeId} not found`);
    }
    if (!user) {
      throw new NotFoundException(`User with ID ${data.userId} not found`);
    }

    // Notification 객체를 생성합니다.
    const newNotification = new Notification();
    newNotification.message = data.message;
    newNotification.board = data.board;
    newNotification.node = node; // Node 엔티티 할당
    newNotification.user = user; // User 엔티티 할당

    // 생성된 Notification 객체를 저장합니다.
    const savedNotification = await this.notificationRepository.save(
      newNotification,
    );

    // 대기 중인 클라이언트를 처리합니다.
    const waitingClient = this.waitingClients.find(
      (client) => client.user_id === data.userId, // 바로 userId를 사용합니다.
    );
    if (waitingClient) {
      console.log(
        `[createNotificationForBoardOwner] Found waiting user: ${data.userId}`, // 바로 userId를 사용합니다.
      );
      clearTimeout(waitingClient.timer);
      waitingClient.resolve(savedNotification);
      this.waitingClients = this.waitingClients.filter(
        (client) => client.user_id !== data.userId, // 바로 userId를 사용합니다.
      );
    } else {
      console.log(
        `[createNotificationForBoardOwner] No waiting user found for: ${data.userId}`, // 바로 userId를 사용합니다.
      );
    }

    return savedNotification;
  }
}
