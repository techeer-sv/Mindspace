import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserSignupRequestDto } from './dto/user-signup-request.dto';
import { UserEmailDuplicatedException } from './exception/UserEmailDuplicatedException';
import { UserNicknameDuplicatedException } from './exception/UserNicknameDuplicatedException';
import { UserMapper } from './dto/user.mapper';

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
});
