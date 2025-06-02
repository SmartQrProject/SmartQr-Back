import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared/entities/user.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RestaurantsModule, CommonModule],
  providers: [UsersService, UsersRepository, MailService],
  controllers: [UsersController],
  exports: [UsersRepository],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
