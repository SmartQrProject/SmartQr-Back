import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { LoggerMiddleware } from 'src/middleware/logger/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';
import { RestaurantTablesService } from './restaurant-tables.service';
import { RestaurantTablesController } from './restaurant-tables.controller';
import { RestaurantTableRepository } from './restaurant-tables.repository';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantTable]), RestaurantsModule, CommonModule],
  providers: [RestaurantTablesService, RestaurantTableRepository, MailService],
  controllers: [RestaurantTablesController],
})
export class RestaurantTablesModule {}
