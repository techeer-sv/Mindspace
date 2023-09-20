import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UserSignupRequestDto } from './user-signup-request.dto';
import { UserResponseDto } from './user-response.dto';
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

  DtoFromEntity(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      nickname: user.nickname,
    };
  }

  nicknameDtoFromEntity(user: User): UserNicknameResponseDto {
    return {
      nickname: user.nickname,
    };
  }
}
