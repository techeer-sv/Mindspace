import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationIdDto {
  @ApiProperty({
    description: '알림 ID',
  })
  @IsNotEmpty()
  @IsString()
  notificationId: string;
}
