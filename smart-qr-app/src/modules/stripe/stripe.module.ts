import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import * as express from 'express';
import { RestaurantsModule } from '../restaurants/restaurants.module';

@Module({
  controllers: [StripeController],
  imports: [RestaurantsModule],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(express.raw({ type: 'application/json' })).forRoutes('stripe/webhook');
  }
}
