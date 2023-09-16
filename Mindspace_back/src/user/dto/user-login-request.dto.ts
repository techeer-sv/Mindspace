import { IsNotEmpty } from 'class-validator';

export class UserLoginRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
