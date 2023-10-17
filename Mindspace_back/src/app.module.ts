import { Request, Response, NextFunction } from 'express';
import {
  Injectable,
  Logger,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Neo4jModule } from 'nest-neo4j';
import { Node } from './node/entities/node.entity';
import { NodeModule } from './node/node.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Board } from './board/entities/board.entity';
import { BoardModule } from './board/board.module';
import { Neo4jNodeModule } from './neo4j-node/neo4j-node.module';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { CustomCommentRepository } from './comment/repository/comment.repository';
import { UtilsModule } from './utils/utils.module';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';
    res.on('finish', () => {
      const { statusCode } = res;
      this.logger.log(
        `${method} ${statusCode} - ${originalUrl} - ${userAgent}`,
      );
    });
    next();
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 전체적으로 사용
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Node, User, Board, Comment, CustomCommentRepository],
      synchronize: true,
    }),
    Neo4jModule.forRoot({
      scheme: 'neo4j',
      host: process.env.NEO4J_HOST,
      port: process.env.NEO4J_PORT,
      username: process.env.NEO4J_USERNAME,
      password: process.env.NEO4J_PASSWORD,
    }),
    NodeModule,
    UserModule,
    BoardModule,
    Neo4jNodeModule,
    CommentModule,
    UtilsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
