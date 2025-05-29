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
import { WebSocketModule } from './modules/websocket/websocket.module';
import { UsersModule } from './modules/users/users.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ReportsModule } from './modules/reports/reports.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './modules/cron/cron.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';

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
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    StripeModule,
    WebSocketModule,
    ChatbotModule,
    CloudinaryModule,
    ReportsModule,
    CronModule,
    SubscriptionModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes('protected'); // 👈 define en qué rutas aplicar el middleware
  }
}
