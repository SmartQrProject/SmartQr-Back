import { Module, MiddlewareConsumer, NestModule, forwardRef } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import * as express from 'express';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { OrdersModule } from '../orders/orders.module';
import { RewardCodeModule } from '../reward-code/reward-code.module';

@Module({
  controllers: [StripeController],
  imports: [forwardRef(() => RestaurantsModule), forwardRef(() => OrdersModule), RewardCodeModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(express.raw({ type: 'application/json' })).forRoutes('stripe/webhook');
  }
}
