import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { auth } from 'express-openid-connect';
import { config } from './config/auth0.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(new LoggerMiddleware().use);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // auth router attaches /login, /logout, and /callback routes to the baseURL
  app.use(auth(config));

  // // req.isAuthenticated is provided from the auth router
  // app.get('/', (req, res) => {
  //   res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
  // });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Smart Qr API')
    .setDescription('Smart Qr API para el PF')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
