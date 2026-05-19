import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './interceptors/transform/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.MODE == "dev") {
    app.setGlobalPrefix('api')
  }
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true
  }))
  app.useGlobalInterceptors(new TransformInterceptor())
  app.enableCors({
    origin: 'https://admin.pivaldi.online',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Accept', 'x-admin-secret'],
    methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
    optionsSuccessStatus: 204,
  })

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
