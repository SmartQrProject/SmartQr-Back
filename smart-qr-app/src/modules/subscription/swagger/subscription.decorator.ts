import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

const SlugParam = ApiParam({
  name: 'slug',
  required: true,
  description: 'Slug of the restaurant whose subscription will be cancelled',
  example: 'eli-cafe',
});

const ApiNotFound = ApiResponse({
  status: 404,
  description: 'Subscription or restaurant not found.',
});

const ApiError = ApiResponse({
  status: 500,
  description: 'Error occurred during cancellation.',
});

export function CancelSubscriptionDoc() {
  return applyDecorators(
    ApiTags('Subscriptions'),
    ApiOperation({
      summary: 'Cancel subscription at end of current period',
      description: 'Cancels the active Stripe subscription for the given restaurant slug. The subscription will remain active until the current billing period ends.',
    }),
    SlugParam,
    ApiResponse({
      status: 200,
      description: 'Subscription successfully marked for cancellation at period end.',
    }),
    ApiNotFound,
    ApiError,
  );
}
