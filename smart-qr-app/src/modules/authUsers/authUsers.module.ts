import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthUsersService } from './authUsers.service';
import { AuthUsersController } from './authUsers.controller';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { requiresAuth } from 'express-openid-connect';
import { AuthUsersRepository } from './authUsers.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RestaurantsModule, CommonModule],
  providers: [AuthUsersService, AuthUsersRepository],
  controllers: [AuthUsersController],
  exports: [AuthUsersRepository],
})
export class AuthUsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth/users');
  }
}
