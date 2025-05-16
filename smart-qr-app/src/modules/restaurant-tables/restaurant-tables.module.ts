import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';
import { RestaurantTablesService } from './restaurant-tables.service';
import { RestaurantTablesController } from './restaurant-tables.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RestaurantsModule, CommonModule],
  providers: [RestaurantTablesService, RestaurantTablesRepository],
  controllers: [RestaurantTablesController],
})
export class RestaurantTablesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
