import { Injectable } from '@nestjs/common';
import { FRONTEND_URL, STRIPE_PRICE_ID, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from 'src/config/env.loader';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class StripeService {
  private stripe = new Stripe(STRIPE_SECRET_KEY);
  constructor(private readonly restaurantsService: RestaurantsService) {}

  // Para pagos únicos
  async createCheckoutSession(): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: 'Producto de prueba' },
            unit_amount: 50,
          },
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/success`,
      cancel_url: `${FRONTEND_URL}/cancel`,
    });
  }

  // Para suscripciones
  async createSubscriptionSession(slug: string): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_URL}/success`,
      cancel_url: `${FRONTEND_URL}/cancel`,

      metadata: {
        slug: slug, // Cambia esto por el ID real del restaurante
      },
    });
  }

  async handleWebhook(req: Request, res: Response, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('❌ Webhook signature verification failed.', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        try {
          const session = event.data.object as Stripe.Checkout.Session;
          const slug = session.metadata?.slug;

          if (!slug) {
            console.warn('⚠️ No se encontró slug en metadata.');
            break;
          }

          console.log('✅ Pago confirmado:', slug);

          await this.restaurantsService.activatePlan(slug);
          console.log('✅ Plan activado para el restaurante:', slug);
        } catch (err) {
          console.error('❌ Error al procesar checkout.session.completed:', err);
        }
        break;
      }

      case 'customer.subscription.created':
        const session = event.data.object as Stripe.Subscription;

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
