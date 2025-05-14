import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RestaurantsModule } from './modules/restaurants/restaurants.module';
import { AuthCustomersModule } from './modules/customers/customers.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { RestaurantTablesModule } from './modules/restaurant-tables/restaurant-tables.module';
import { OrderItemsModule } from './modules/order-items/order-items.module';
import { RewardCodeModule } from './modules/reward-code/reward-code.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './db/database.module';
import { authMiddleware } from 'src/middleware/auth.middleware';
import { AppController } from './app.controller';
import { StripeModule } from './modules/stripe/stripe.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    DatabaseModule,
    RestaurantsModule,
    UsersModule,
    AuthCustomersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    RestaurantTablesModule,
    OrderItemsModule,
    RewardCodeModule,
    ConfigModule.forRoot({ isGlobal: true }),
    StripeModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes('protected'); // 👈 define en qué rutas aplicar el middleware
  }
}
