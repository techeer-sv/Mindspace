import { Controller, Post, Get, Body, HttpStatus, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { UserMapper } from './dto/user.mapper';
import { UserSignupRequestDto } from './dto/user-signup-request.dto';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { Response } from 'express';
import {ApiOperation, ApiTags} from '@nestjs/swagger';

@ApiTags('User')
@Controller('api/v1/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @ApiOperation({ summary: '회원가입' })
  @Post('/signup')
  async signupUser(
    @Body() userSignupRequestDto: UserSignupRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const signupResult = await this.userService.signupUser(
      userSignupRequestDto,
    );
    const response = this.userMapper.DtoFromEntity(signupResult);
    res.status(HttpStatus.CREATED).json(response);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('/login')
  async loginUser(
    @Body() userLoginRequestDto: UserLoginRequestDto,
    @Res() res: Response,
  ): Promise<void> {
    const loginResult = await this.userService.loginUser(userLoginRequestDto);
    const response = this.userMapper.DtoFromEntity(loginResult);
    res.status(HttpStatus.OK).json(response);
  }

  @ApiOperation({ summary: '회원 전체 조회' })
  @Get('/all')
  async getAllUser(@Res() res: Response): Promise<void> {
    const users = await this.userService.getAllUser();
    res.status(HttpStatus.OK).json(users);
  }
}
