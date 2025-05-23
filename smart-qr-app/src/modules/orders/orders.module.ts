import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';

import { Order } from 'src/shared/entities/order.entity';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { Customer } from 'src/shared/entities/customer.entity';
import { Product } from 'src/shared/entities/product.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { RewardCodeModule } from '../reward-code/reward-code.module';
import { CommonModule } from 'src/common/common.module';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Customer,
      Product,
      Restaurant,
      RestaurantTable,
    ]),
    RewardCodeModule,
    CommonModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, MailService],
})
export class OrdersModule {}
