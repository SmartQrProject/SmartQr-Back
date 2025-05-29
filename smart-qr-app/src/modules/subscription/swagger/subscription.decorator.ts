import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

export function CancelSubscriptionDoc() {
  return applyDecorators(
    ApiTags('Subscriptions'),
    ApiOperation({
      summary: 'Cancel subscription at end of current period',
      description: 'Cancels the active Stripe subscription for the given restaurant slug. The subscription will remain active until the current billing period ends.',
    }),
    ApiParam({
      name: 'slug',
      required: true,
      description: 'Slug of the restaurant whose subscription will be cancelled',
      example: 'eli-cafe',
    }),
    ApiResponse({
      status: 200,
      description: 'Subscription successfully marked for cancellation at period end.',
    }),
    ApiResponse({
      status: 404,
      description: 'Subscription or restaurant not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Error occurred during cancellation.',
    }),
  );
}
