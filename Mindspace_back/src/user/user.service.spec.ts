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

describe('UserService', () => {
  let service: UserService;
  let repo: Repository<User>;
  let mapper: UserMapper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useClass: Repository },
        {
          provide: UserMapper,
          useValue: { DtoToEntity: jest.fn().mockReturnValue(new User()) },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    mapper = module.get<UserMapper>(UserMapper);
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
        // other necessary properties...
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
});
