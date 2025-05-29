import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiBody } from '@nestjs/swagger';

export function GetCheckoutSessionDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create one-time payment session (Checkout)',
      description: 'Returns a session ID and a URL to redirect the user to the Stripe checkout.',
    }),
    ApiBody({
      description: 'Total amount (will be multiplied by 100 internally)',

      schema: {
        type: 'object',
        properties: {
          total: {
            type: 'string',
            example: '2500',
          },
        },
        required: ['total'],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Payment session created successfully',
      schema: {
        example: {
          id: 'cs_test_a1B2C3D4E5',
          url: 'https://checkout.stripe.com/pay/cs_test_a1B2C3D4E5',
        },
      },
    }),
  );
}

export function GetSubscriptionSessionDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create subscription session (Checkout)',
      description: 'Returns a session ID and a URL to redirect the user to the Stripe subscription flow.',
    }),
    ApiResponse({
      status: 200,
      description: 'Subscription session created successfully',

      schema: {
        example: {
          id: 'cs_test_sub_123456',
          url: 'https://checkout.stripe.com/pay/cs_test_sub_123456',
        },
      },
    }),
  );
}

export function WebhookStripeDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listen to Stripe webhook events',
      description: 'This endpoint should be called directly by Stripe to handle events such as completed payments, failures, cancellations, etc.',
    }),
    ApiHeader({
      name: 'stripe-signature',
      description: 'Signature sent by Stripe to verify the authenticity of the event',

      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Event processed successfully',

      schema: {
        example: { received: true },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid signature or validation error',

      schema: {
        example: { message: 'Webhook error: Signature could not be verified' },
      },
    }),
  );
}
