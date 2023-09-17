import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserMapper } from './dto/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserMapper],
  controllers: [UserController],
})
export class UserModule {}
