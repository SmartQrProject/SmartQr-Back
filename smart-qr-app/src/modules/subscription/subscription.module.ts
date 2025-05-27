import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionService } from './subscription.service';
import { Subscription } from 'src/shared/entities/subscription.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Restaurant])],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
