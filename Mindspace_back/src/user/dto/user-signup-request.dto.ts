import { IsNotEmpty } from 'class-validator';

export class UserSignupRequestDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  nickname: string;
}
