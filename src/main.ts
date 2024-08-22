import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("main");
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RestAPI')
    .setDescription('Teslo Shop endpoints')    
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/swagger', app, document,{
    jsonDocumentUrl: 'api/swagger/json',
  });

  await app.listen(process.env.PORT);
  logger.log(`App running on port ${process.env.PORT}`);
}
bootstrap();
