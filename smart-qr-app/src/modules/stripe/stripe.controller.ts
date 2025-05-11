import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  Headers,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import {
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from 'src/config/env.loader';

@Controller('stripe')
export class StripeController {
  private stripe = new Stripe(STRIPE_SECRET_KEY);

  constructor(private readonly stripeService: StripeService) {}

  @Get('checkout-session')
  async getCheckoutSession() {
    const session = await this.stripeService.createCheckoutSession();
    return { id: session.id, url: session.url };
  }

  @Get('subscription-session')
  async getSubscriptionSession() {
    const session = await this.stripeService.createSubscriptionSession();
    return { id: session.id, url: session.url };
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: Request,
    @Res() res: Response,
    @Headers('stripe-signature') signature: string,
  ) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        req.body,
        signature,
        STRIPE_WEBHOOK_SECRET!,
      );
    } catch (err) {
      console.error('❌ Webhook signature verification failed.', err.message);
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(`Webhook error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('✅ Pago confirmado:', session.id);
        break;
      }

      case 'customer.subscription.created':
        console.log('📦 Suscripción creada');
        break;

      case 'customer.subscription.updated':
        console.log('🔁 Suscripción actualizada');
        break;

      case 'customer.subscription.deleted':
        console.log('❌ Suscripción cancelada');
        break;

      case 'invoice.paid':
        console.log('💵 Factura pagada');
        break;

      case 'invoice.payment_failed':
        console.log('❌ Fallo de pago de suscripción');
        break;

      case 'checkout.session.expired':
        console.log('⏰ Sesión expirada sin pagar');
        break;

      default:
        console.log(`📌 Evento recibido (no manejado): ${event.type}`);
        break;
    }

    return res.status(200).json({ received: true });
  }
}
