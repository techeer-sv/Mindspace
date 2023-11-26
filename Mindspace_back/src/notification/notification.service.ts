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
    userId: number;
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    timer: NodeJS.Timeout;
  }[] = [];

  private addToWaitingClients(client: {
    userId: number;
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
    timer: NodeJS.Timeout;
  }) {
    this.waitingClients.push(client);
  }

  async waitForNewNotifications(userId: number): Promise<Notification> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const index = this.waitingClients.findIndex(
          (client) => client.userId === userId,
        );
        if (index !== -1) {
          this.waitingClients.splice(index, 1);
          reject(new NoNotificationException());
        }
      }, this.TIMEOUT_DURATION);

      this.addToWaitingClients({ userId, resolve, reject, timer });
    });
  }

  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user: { id: userId } },
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
    nodeId: number;
    userId: number;
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

    // 게시글 작성자인지 확인
    if (data.userId !== data.board.user.id) {
      console.log(`User ${data.userId} is not the author of the post.`);
      return; // 게시글 작성자가 아니면 알림을 생성하지 않습니다.
    }

    // Notification 객체를 생성합니다.
    const newNotification = new Notification();
    newNotification.message = data.message;
    newNotification.board = data.board;
    newNotification.node = node;
    newNotification.user = user;

    // 생성된 Notification 객체를 저장합니다.
    const savedNotification = await this.notificationRepository.save(
      newNotification,
    );

    // 대기 중인 클라이언트를 처리합니다.
    const waitingClient = this.waitingClients.find(
      (client) => client.userId === data.userId,
    );
    if (waitingClient) {
      console.log(
        `[createNotificationForBoardOwner] Found waiting user: ${data.userId}`,
      );
      clearTimeout(waitingClient.timer);
      waitingClient.resolve(savedNotification);
      this.waitingClients = this.waitingClients.filter(
        (client) => client.userId !== data.userId,
      );
    } else {
      console.log(
        `[createNotificationForBoardOwner] No waiting user found for: ${data.userId}`,
      );
    }

    return savedNotification;
  }
}
