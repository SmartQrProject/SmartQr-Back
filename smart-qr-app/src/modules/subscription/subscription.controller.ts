import { Controller, Param, Patch } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CancelSubscriptionDoc } from './swagger/subscription.decorator';

@ApiTags('Subscriptions')
@Controller(':slug')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Patch('cancel')
  @CancelSubscriptionDoc()
  async cancelSubscription(@Param('slug') slug: string) {
    return this.subscriptionService.cancelSubscription(slug);
  }
}
