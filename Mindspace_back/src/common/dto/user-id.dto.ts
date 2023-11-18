import { IsNotEmpty, IsString } from 'class-validator';

export class UserIdDto {
  @IsString()
  @IsNotEmpty()
  user_id: string;
}
