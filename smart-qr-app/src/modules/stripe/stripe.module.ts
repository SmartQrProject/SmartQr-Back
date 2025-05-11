import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';
import * as express from 'express';

@Module({
  controllers: [StripeController],
  providers: [StripeService],
  exports: [StripeService],
})
export class StripeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(express.raw({ type: 'application/json' }))
      .forRoutes('stripe/webhook');
  }
}
