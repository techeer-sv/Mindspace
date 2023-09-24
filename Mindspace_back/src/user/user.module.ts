import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserMapper } from './dto/user.mapper';

// user.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserMapper],  // UserService가 여기에 포함되어 있어야 합니다.
  controllers: [UserController],
  exports: [UserService]  // UserService를 내보내야 합니다.
})
export class UserModule {}

