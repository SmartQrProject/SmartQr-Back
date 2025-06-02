import { PassportModule } from '@nestjs/passport';
import { JwtStrategy4Auth0 } from 'src/common/services/jwt.strategy4Auth0';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { CustomersRepository } from './customers.repository';
import { Customer } from 'src/shared/entities/customer.entity';
import { CommonModule } from 'src/common/common.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    RestaurantsModule,
    CommonModule,
    PassportModule,
  ],
  providers: [
    CustomersService,
    CustomersRepository,
    JwtStrategy4Auth0,
    MailService,
  ],
  controllers: [CustomersController],
  exports: [CustomersRepository],
})
export class AuthCustomersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('customers');
  }
}
