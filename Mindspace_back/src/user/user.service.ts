import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserSignupRequestDto } from './dto/user-signup-request.dto';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UserMapper } from './dto/user.mapper';
import { UserNicknameResponseDto } from './dto/user-nickname-response.dto';
import { UserEmailDuplicatedException } from './exception/UserEmailDuplicatedException';
import { UserNicknameDuplicatedException } from './exception/UserNicknameDuplicatedException';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { UserInvalidPasswordException } from './exception/UserInvalidPasswordException';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  async signupUser(userSignupRequestDto: UserSignupRequestDto): Promise<User> {
    const emailExists = await this.userRepository.findOne({
      where: { email: userSignupRequestDto.email },
    });
    if (emailExists) {
      throw new UserEmailDuplicatedException();
    }

    const nicknameExists = await this.userRepository.findOne({
      where: { nickname: userSignupRequestDto.nickname },
    });
    if (nicknameExists) {
      throw new UserNicknameDuplicatedException();
    }

    const userEntity = this.userMapper.DtoToEntity(userSignupRequestDto);
    return await this.userRepository.save(userEntity);
  }

  async loginUser(userLoginRequestDto: UserLoginRequestDto): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email: userLoginRequestDto.email },
    });

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.password !== userLoginRequestDto.password) {
      throw new UserInvalidPasswordException();
    }

    // TODO: jwt token
    return user;
  }

  async getAllUser(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } }); // `where` 키워드 추가

    if (!user) {
      throw new UserNotFoundException();
    }
    return user;
  }

  async getUserNickname(userId: string): Promise<UserNicknameResponseDto> {
    const user = await this.isUserExisted(Number(userId));
    return this.userMapper.nicknameDtoFromEntity(user);
  }

  async isUserExisted(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
