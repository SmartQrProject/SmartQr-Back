import { PassportModule } from '@nestjs/passport';
import { JwtStrategy4Auth0 } from 'src/common/services/jwt.strategy4Auth0';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { requiresAuth } from 'express-openid-connect';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { AuthCustomersService } from './authCustomers.service';
import { AuthCustomersController } from './authCustomers.controller';
import { AuthCustomersRepository } from './authCustomers.repository';
import { Customer } from 'src/shared/entities/customer.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    RestaurantsModule,
    CommonModule,
    PassportModule,
  ],
  providers: [AuthCustomersService, AuthCustomersRepository, JwtStrategy4Auth0],
  controllers: [AuthCustomersController],
  exports: [AuthCustomersRepository],
})
export class AuthCustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('auth/customers');
    //consumer.apply(requiresAuth()).forRoutes('auth/customers');
  }
}
