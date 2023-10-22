import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { Board } from '../board/entities/board.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  private waitingClients: any[] = [];

  async waitForNewNotifications(userId: number): Promise<Notification> {
    return new Promise((resolve, reject) => {
      this.waitingClients.push({
        userId: userId,
        resolve: resolve,
        timer: setTimeout(() => {
          const index = this.waitingClients.findIndex(
            (client) => client.userId === userId,
          );
          if (index !== -1) {
            this.waitingClients.splice(index, 1);
            reject(new NotFoundException('No new notifications'));
          }
        }, 30000), // 30 seconds timeout for long polling
      });
    });
  }

  async createNotificationForBoardOwner(data: {
    board: Board;
    message: string;
    commentId: number;
    nodeId: number;
  }): Promise<Notification> {
    const newNotification = new Notification();
    newNotification.message = data.message;
    newNotification.board = data.board; // Assigning the board directly since it's a ManyToOne relationship.
    newNotification.nodeId = data.nodeId;

    const savedNotification = await this.notificationRepository.save(
      newNotification,
    );

    // Long Polling logic for notifying the board owner
    const index = this.waitingClients.findIndex(
      (client) => client.userId === data.board.userId,
    );
    if (index !== -1) {
      clearTimeout(this.waitingClients[index].timer);
      this.waitingClients[index].resolve(savedNotification);
      this.waitingClients.splice(index, 1);
    }

    return savedNotification;
  }

  async createNotification(data: {
    user_id: number;
    message: string;
    board_id: number;
    node_id: number;
  }) {
    const notification = this.notificationRepository.create(data);
    await this.notificationRepository.save(notification);
  }

  async deleteNotification(id: number): Promise<void> {
    const result = await this.notificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
  }
}
