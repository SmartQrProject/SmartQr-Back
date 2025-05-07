import { Module } from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { RestaurantTablesController } from './restaurant-tables.controller';

@Module({
  controllers: [RestaurantTablesController],
  providers: [RestaurantTablesService],
})
export class RestaurantTablesModule {}
