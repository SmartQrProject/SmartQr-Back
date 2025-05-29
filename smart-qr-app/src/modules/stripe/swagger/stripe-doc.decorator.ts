import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';

const StripeHeader = ApiHeader({
  name: 'stripe-signature',
  description: 'Signature sent by Stripe to verify the authenticity of the event',
  required: true,
});

const StripeSuccessResponse = ApiResponse({
  status: 200,
  description: 'Event processed successfully',
  schema: { example: { received: true } },
});

const StripeErrorResponse = ApiResponse({
  status: 400,
  description: 'Invalid signature or validation error',
  schema: { example: { message: 'Webhook error: Signature could not be verified' } },
});

export function WebhookStripeDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Listen to Stripe webhook events',
      description: 'This endpoint should be called directly by Stripe to handle events such as completed payments, failures, cancellations, etc.',
    }),
    StripeHeader,
    StripeSuccessResponse,
    StripeErrorResponse,
  );
}
