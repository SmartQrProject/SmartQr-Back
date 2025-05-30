import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemsService } from './order-items.service';
//import { OrderItemsController } from './order-items.controller';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { Order } from 'src/shared/entities/order.entity';
import { Product } from 'src/shared/entities/product.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { CommonModule } from 'src/common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem, Order, Product, Restaurant]), CommonModule],
  // controllers: [OrderItemsController],
  providers: [OrderItemsService],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
