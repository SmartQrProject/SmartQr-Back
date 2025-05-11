import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { requiresAuth } from 'express-openid-connect';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, AuthService],
  controllers: [AuthController],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth');
    consumer.apply(requiresAuth()).forRoutes('auth/whoAmI');
  }
}
