import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  app.use(cookieParser());

  app.setGlobalPrefix('api/v1');

  const port = configService.get<number>('PORT') || 8000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port} successfully.`);
}
bootstrap();
