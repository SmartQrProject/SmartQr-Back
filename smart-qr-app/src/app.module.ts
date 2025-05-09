import { Module } from '@nestjs/common';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CustomersModule } from './modules/customers/customers.module';
import { RestaurantTablesModule } from './modules/restaurant-tables/restaurant-tables.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { RewardCodeModule } from './modules/reward-code/reward-code.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';

@Module({
  imports: [
    DatabaseModule,
    RestaurantsModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    CustomersModule,
    RestaurantTablesModule,
    OrderItemsModule,
    RewardCodeModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
