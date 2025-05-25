import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FRONTEND_URL, STRIPE_PRICE_ID, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from 'src/config/env.loader';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { OrdersService } from '../orders/orders.service';
import { RewardCodeService } from '../reward-code/reward-code.service';

@Injectable()
export class StripeService {
  private stripe = new Stripe(STRIPE_SECRET_KEY);
  constructor(
    private readonly restaurantsService: RestaurantsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly rewardCodeService: RewardCodeService,
  ) {}

  // Para pagos únicos
  async createCheckoutSession(line_items: Stripe.Checkout.SessionCreateParams.LineItem[], id): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${FRONTEND_URL}/success-orders`,
      cancel_url: `${FRONTEND_URL}/cancel-orders`,
      metadata: {
        type: 'order',
        slug: id, // Cambia esto por el ID real del restaurante
      },
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
        type: 'subscription',
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

    // ✅ Responder de inmediato para que Stripe no reintente
    res.status(200).json({ received: true });

    setTimeout(() => {
      this.handleEvent(event);
    }, 20000);
  }

  private async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        try {
          const session = event.data.object as Stripe.Checkout.Session;
          const { slug, type, orderId, rewardCode } = session.metadata || {};

          if (!slug || !type) {
            console.warn('⚠️ Faltan datos en metadata.');
            break;
          }

          if (type === 'subscription') {
            console.log('✅ Suscripción confirmada:', slug);
            await this.restaurantsService.activatePlan(slug);
            console.log('✅ Plan activado para restaurante:', slug);
          }

          if (type === 'order') {
            if (!orderId) {
              console.warn('⚠️ orderId no encontrado en metadata.');
              break;
            }
            console.log('✅ Orden confirmada:', orderId);
            await this.ordersService.activateOrder(orderId);
            if (rewardCode) {
              console.log('🎁 Código de recompensa aplicado:', rewardCode);
              await this.rewardCodeService.deactivateCode(rewardCode);
            }

            console.log('✅ Orden activada:', orderId);
          }
        } catch (err) {
          console.error('❌ Error en checkout.session.completed:', err);
        }
        break;
      }

      case 'customer.subscription.created': {
        const session = event.data.object as Stripe.Subscription;
        console.log('📦 Suscripción creada');
        break;
      }

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
  }
}
