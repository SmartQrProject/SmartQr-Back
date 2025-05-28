import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { TraceMiddleware } from './middleware/trace/trace.middleware';

async function bootstrap() {
  const server = express();
  server.use('/stripe/webhook', express.raw({ type: 'application/json' }));

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.use(new TraceMiddleware().use);
  app.use(new LoggerMiddleware().use);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder().setTitle('Smart Qr API').setDescription('Smart Qr API para el PF').setVersion('1.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT ?? 3000;

  app.enableCors({
    origin: ['http://localhost:3000', 'https://smart-qr-front.vercel.app', 'https://www.smart-qr.tech'],
    credentials: true,
  });

  await app.listen(port);

  console.log(`🚀 App listening on port ${port}`);
}
bootstrap();
