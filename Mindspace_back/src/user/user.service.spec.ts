import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserSignupRequestDto } from './dto/user-signup-request.dto';
import { UserEmailDuplicatedException } from './exception/UserEmailDuplicatedException';
import { UserNicknameDuplicatedException } from './exception/UserNicknameDuplicatedException';
import { UserMapper } from './dto/user.mapper';
import { UserNotFoundException } from './exception/UserNotFoundException';
import { UserInvalidPasswordException } from './exception/UserInvalidPasswordException';
import { UserNicknameResponseDto } from './dto/user-nickname-response.dto';

type MockUserMapper = {
  nicknameDtoFromEntity: jest.Mock;
};

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;
  let mapper: MockUserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: Repository },
        {
          provide: UserMapper,
          useValue: {
            DtoToEntity: jest.fn().mockReturnValue(new User()),
            nicknameDtoFromEntity: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    mapper = module.get<MockUserMapper>(UserMapper);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signupUser', () => {
    it('should create a user if email and nickname are unique', async () => {
      const dto = new UserSignupRequestDto();
      dto.email = 'test@test.com';
      dto.nickname = 'testNickname';
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);
      jest.spyOn(repo, 'save').mockResolvedValue(dto as any);

      const result = await service.signupUser(dto);

      expect(result).toEqual(dto);
    });

    it('should throw UserEmailDuplicatedException if email already exists', async () => {
      const dto = new UserSignupRequestDto();
      dto.email = 'test@test.com';
      dto.nickname = 'testNickname';
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(new User());

      await expect(service.signupUser(dto)).rejects.toThrow(
        UserEmailDuplicatedException,
      );
    });

    it('should throw UserNicknameDuplicatedException if nickname already exists', async () => {
      const dto = new UserSignupRequestDto();
      dto.email = 'test@test.com';
      dto.nickname = 'testNickname';
      jest
        .spyOn(repo, 'findOne')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(new User());

      await expect(service.signupUser(dto)).rejects.toThrow(
        UserNicknameDuplicatedException,
      );
    });
  });

  describe('loginUser', () => {
    it('should throw UserNotFoundException if user does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(null);

      await expect(
        service.loginUser({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(UserNotFoundException);
    });

    it('should throw UserInvalidPasswordException if password does not match', async () => {
      const fakeUser: Partial<User> = {
        password: 'correct_password',
      };

      jest.spyOn(repo, 'findOne').mockResolvedValue(fakeUser as User);

      await expect(
        service.loginUser({
          email: 'test@test.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UserInvalidPasswordException);
    });

    it('should return user if user exists and password matches', async () => {
      const user = { email: 'test@test.com', password: 'password' }; // add necessary properties
      jest.spyOn(repo, 'findOne').mockResolvedValue(user as User);

      const result = await service.loginUser(user);
      expect(result).toEqual(user);
    });
  });

  describe('getAllUser', () => {
    it('should return a list of users', async () => {
      const testUsers: User[] = [
        Object.assign(new User(), {
          id: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          email: 'test1@example.com',
          password: 'testPassword1',
          nickname: 'testUser1',
          isActive: true,
        }),
        Object.assign(new User(), {
          id: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          email: 'test2@example.com',
          password: 'testPassword2',
          nickname: 'testUser2',
          isActive: true,
        }),
      ];

      jest.spyOn(repo, 'find').mockResolvedValue(testUsers);

      const result = await service.getAllUser();
      expect(result).toEqual(testUsers);
    });
  });

  describe('findUserById', () => {
    it('should return a user if user exists', async () => {
      const testUser: User = Object.assign(new User(), {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        email: 'test1@example.com',
        password: 'testPassword1',
        nickname: 'testUser1',
        isActive: true,
      });

      jest.spyOn(repo, 'findOne').mockResolvedValue(testUser);

      const result = await service.findUserById(1);
      expect(result).toEqual(testUser);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValue(undefined);

      try {
        await service.findUserById(1);
      } catch (e) {
        expect(e).toBeInstanceOf(UserNotFoundException);
      }
    });
  });

  describe('getUserNickname', () => {
    it('should return a UserNicknameResponseDto if user exists', async () => {
      const testUser: User = Object.assign(new User(), {
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        email: 'test1@example.com',
        password: 'testPassword1',
        nickname: 'testNickname1',
        isActive: true,
      });
      const testUserNicknameResponseDto: UserNicknameResponseDto = {
        nickname: testUser.nickname,
      };

      jest.spyOn(service, 'isUserExisted').mockResolvedValue(testUser);
      mapper.nicknameDtoFromEntity.mockReturnValue(testUserNicknameResponseDto);

      const result = await service.getUserNickname(1);
      expect(result).toEqual(testUserNicknameResponseDto);
    });

    it('should throw UserNotFoundException if user does not exist', async () => {
      jest.spyOn(service, 'isUserExisted').mockResolvedValue(undefined);

      try {
        await service.getUserNickname(1);
      } catch (e) {
        expect(e).toBeInstanceOf(UserNotFoundException);
      }
    });
  });
});
