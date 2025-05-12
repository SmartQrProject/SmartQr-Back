import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { requiresAuth } from 'express-openid-connect';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth');
    consumer.apply(requiresAuth()).forRoutes('auth/login');
  }
}
