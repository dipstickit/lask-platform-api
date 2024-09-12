import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { TransformInterceptor } from './core/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const reflector = app.get(Reflector);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  app.use(cookieParser());
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  // config api version
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.setGlobalPrefix('api');

  // validation config for class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // config swagger
  const config = new DocumentBuilder()
    .setTitle('Lask Platform API')
    .setDescription('API documentation for the Lask Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addSecurityRequirements('bearer')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(
    `Application is running on: http://localhost:${port} successfully.`,
  );
}
bootstrap();
