import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Board } from '../board/entities/board.entity';
import { NoNotificationException } from './exception/NoNotificationException';

@Injectable()
export class NotificationService {
  private readonly TIMEOUT_DURATION = 30000;

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
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

  async waitForNotification(userId: number): Promise<Notification> {
    console.log(`[waitForNotification] User ${userId} started waiting.`);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const index = this.waitingClients.findIndex(
          (client) => client.userId === userId,
        );
        if (index !== -1) this.waitingClients.splice(index, 1);
        reject(new NoNotificationException());
      }, this.TIMEOUT_DURATION);

      this.addToWaitingClients({ userId, resolve, reject, timer });
    });
  }

  async waitForNewNotifications(userId: number): Promise<Notification> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        const index = this.waitingClients.findIndex(
          (client) => client.userId === userId,
        );
        if (index !== -1) {
          this.waitingClients.splice(index, 1);
          reject(new NotFoundException('No new notifications'));
        }
      }, this.TIMEOUT_DURATION);

      this.addToWaitingClients({ userId, resolve, reject, timer });
    });
  }

  async getNotificationsForUser(user_id: number): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: { user_id: user_id },
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
    const newNotification = new Notification();
    newNotification.message = data.message;
    newNotification.board = data.board;
    newNotification.nodeId = data.nodeId;
    newNotification.user_id = data.userId;

    const savedNotification = await this.notificationRepository.save(
      newNotification,
    );

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
