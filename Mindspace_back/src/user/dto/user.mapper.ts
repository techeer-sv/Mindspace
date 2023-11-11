import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserSignupRequestDto } from './user-signup-request.dto';
import { UserNicknameResponseDto } from './user-nickname-response.dto';

@Injectable()
export class UserMapper {
  DtoToEntity(userRequestDto: UserSignupRequestDto): User {
    const user = new User();
    user.email = userRequestDto.email;
    user.password = userRequestDto.password;
    user.nickname = userRequestDto.nickname;
    return user;
  }

  DtoFromEntity(user: User): { id: number } {
    return {
      id: user.id,
    };
  }

  nicknameDtoFromEntity(user: User): UserNicknameResponseDto {
    return {
      nickname: user.nickname,
    };
  }
}
