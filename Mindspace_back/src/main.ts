import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NodeService } from './node/node.service';
//import { GlobalExceptionFilter } from './global/common/globalExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: true,
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204,
      credentials: true,
    },
  });

  const options = new DocumentBuilder()
    .setTitle('Mindspace API')
    .setDescription('Mindspace API description')
    .setVersion('1.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  // FIXME: GlobalExceptionFilter를 사용하면 일부 예외처리가 되지 않아 해결 필요
  //app.useGlobalFilters(new GlobalExceptionFilter());
  const nodeService = app.get(NodeService);
  await nodeService.seedInitialData();
  await app.listen(8000);
}
bootstrap();
