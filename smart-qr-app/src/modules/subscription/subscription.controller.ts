import { Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CancelSubscriptionDoc } from './swagger/subscription.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/role.enum';

@ApiTags('Subscriptions')
@Controller(':slug/subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Patch('cancel')
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @CancelSubscriptionDoc()
  async cancelSubscription(@Param('slug') slug: string) {
    return this.subscriptionService.cancelSubscription(slug);
  }

  @Get()
  @Roles(Role.Owner)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get subscription by restaurant slug' })
  async getSubscriptionBySlug(@Param('slug') slug: string) {
    return this.subscriptionService.getByRestaurantSlug(slug);
  }
}
