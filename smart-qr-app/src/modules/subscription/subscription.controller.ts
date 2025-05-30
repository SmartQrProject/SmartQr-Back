import { Controller, Get, Param, Patch } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CancelSubscriptionDoc } from './swagger/subscription.decorator';

@ApiTags('Subscriptions')
@Controller(':slug/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Patch('cancel')
  @CancelSubscriptionDoc()
  async cancelSubscription(@Param('slug') slug: string) {
    return this.subscriptionService.cancelSubscription(slug);
  }

  @Get()
  @ApiOperation({ summary: 'Get subscription by restaurant slug' })
  async getSubscriptionBySlug(@Param('slug') slug: string) {
    return this.subscriptionService.getByRestaurantSlug(slug);
  }
}
