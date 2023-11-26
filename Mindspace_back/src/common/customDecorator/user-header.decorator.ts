import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const UserHeader = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const user_id = request.headers['user_id'];

    if (!user_id) {
      throw new BadRequestException('헤더에 user_id 값이 필요합니다.');
    }

    if (user_id.trim().length === 0) {
      throw new BadRequestException('user_id 헤더는 비어있을 수 없습니다.');
    }

    return user_id;
  },
);
