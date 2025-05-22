import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiHeader, ApiBody } from '@nestjs/swagger';

export function GetCheckoutSessionDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Crear sesión de pago única (Checkout)',
      description: 'Devuelve un ID de sesión y una URL para redirigir al usuario al checkout de Stripe.',
    }),
    ApiBody({
      description: 'Total en centavos (ej: 2500 para $25.00)',
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
      description: 'Sesión de pago creada exitosamente',
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
      summary: 'Crear sesión de suscripción (Checkout)',
      description: 'Devuelve un ID de sesión y una URL para redirigir al usuario al flujo de suscripción de Stripe.',
    }),
    ApiResponse({
      status: 200,
      description: 'Sesión de suscripción creada exitosamente',
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
      summary: 'Escucha eventos del webhook de Stripe',
      description: 'Este endpoint debe ser llamado directamente por Stripe para manejar eventos como pagos completados, fallos, cancelaciones, etc.',
    }),
    ApiHeader({
      name: 'stripe-signature',
      description: 'Firma enviada por Stripe para verificar la autenticidad del evento',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Evento procesado exitosamente',
      schema: {
        example: { received: true },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Firma inválida o error de validación',
      schema: {
        example: { message: 'Webhook error: No se pudo verificar la firma' },
      },
    }),
  );
}
