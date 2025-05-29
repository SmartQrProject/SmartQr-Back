import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { Subscription } from 'src/shared/entities/subscription.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { StripeModule } from '../stripe/stripe.module';
import { SubscriptionController } from './subscription.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Restaurant]), StripeModule],
  providers: [SubscriptionService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
