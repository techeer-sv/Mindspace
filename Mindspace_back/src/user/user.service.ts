import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSignupRequestDto } from './dto/user-signup-request.dto';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UserMapper } from './dto/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async signupUser(userSignupRequestDto: UserSignupRequestDto): Promise<User> {
    const userEntity = this.userMapper.DtoToEntity(userSignupRequestDto);
    return await this.userRepository.save(userEntity);
  }

  async loginUser(userLoginRequestDto: UserLoginRequestDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userLoginRequestDto.email },
    });

    if (!user) {
      throw new Error('해당 이메일로 가입한 사용자 없음');
    }

    if (user.password !== userLoginRequestDto.password) {
      throw new Error('비밀번호 오류');
    }

    // TODO: jwt token
    return user;
  }

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }
}
