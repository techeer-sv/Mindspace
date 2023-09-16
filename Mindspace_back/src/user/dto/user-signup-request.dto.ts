import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserSignupRequestDto {
  @ApiProperty({ description: 'email', example: 'user@example.com' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'password', example: '1234' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'nickname', example: 'user' })
  @IsNotEmpty()
  nickname: string;
}
