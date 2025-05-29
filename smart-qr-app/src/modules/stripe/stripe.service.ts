import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { FRONTEND_URL, STRIPE_PRICE_ID, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from 'src/config/env.loader';
import { Request, Response } from 'express';
import { HttpStatus } from '@nestjs/common';
import Stripe from 'stripe';
import { RewardCodeService } from '../reward-code/reward-code.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/shared/entities/subscription.entity';

@Injectable()
export class StripeService {
  private stripe = new Stripe(STRIPE_SECRET_KEY);
  constructor(
    private readonly rewardCodeService: RewardCodeService,
    private eventEmitter: EventEmitter2,
  ) {}

  // Para pagos únicos
  async createCheckoutSession(line_items: Stripe.Checkout.SessionCreateParams.LineItem[], id, rewardCode): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items,
      success_url: `${FRONTEND_URL}/success-orders`,
      cancel_url: `${FRONTEND_URL}/cancel-orders`,
      metadata: {
        type: 'order',
        orderId: id,
        rewardCode: rewardCode ?? '',
      },
    });
  }

  // Para suscripciones
  async createSubscriptionSession(slug: string, isTrial: boolean = false): Promise<Stripe.Checkout.Session> {
    const payload: Stripe.Checkout.SessionCreateParams = {
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
        slug: slug,
      },
      subscription_data: {
        trial_period_days: isTrial ? 14 : undefined,
        metadata: {
          slug,
        },
      },
    };

    console.log('📤 Enviando a Stripe - Create Subscription Payload:', JSON.stringify(payload, null, 2));

    const session = await this.stripe.checkout.sessions.create(payload);

    console.log('📥 Respuesta de Stripe - Subscription Session creada:', JSON.stringify(session, null, 2));

    return session;
  }

  async handleWebhook(req: Request, res: Response, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(req.body, signature, STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      console.error('❌ Webhook signature verification failed.', err.message);
      return res.status(HttpStatus.BAD_REQUEST).send(`Webhook error: ${err.message}`);
    }

    console.log('📥 Webhook recibido:', JSON.stringify(event, null, 2));

    res.status(200).json({ received: true });

    this.handleEvent(event);
  }

  private async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        try {
          const session = event.data.object as Stripe.Checkout.Session;

          const { slug, type, orderId, rewardCode } = session.metadata || {};
          console.log('✅ metadata :', session.metadata);

          if (!type) {
            console.warn('⚠️ Tipo de sesión no especificado en metadata.');
            break;
          }

          if (type === 'subscription') {
            console.log('✅ Suscripción confirmada:', slug);
            const stripeSubscriptionId = session.subscription as string;

            const stripeSubscription = await this.stripe.subscriptions.retrieve(stripeSubscriptionId);

            this.eventEmitter.emit('restaurant.paid', slug); //activa el restorant
            this.eventEmitter.emit('subscription.paid', {
              slug,
              stripeSubscriptionId: stripeSubscription.id,
              customerId: stripeSubscription.customer as string,
              status: stripeSubscription.status,
              plan: stripeSubscription.items.data[0]?.price.id,
              currentPeriodEnd: new Date(
                stripeSubscription.trial_end
                  ? stripeSubscription.trial_end * 1000
                  : stripeSubscription.ended_at
                    ? stripeSubscription.ended_at * 1000
                    : stripeSubscription.created * 1000,
              ),
              isTrial: stripeSubscription.trial_end != null,
            });

            console.log('✅ Plan activado para restaurante:', slug);
          }

          if (type === 'order') {
            if (!orderId) {
              console.warn('⚠️ orderId no encontrado en metadata.');
              break;
            }
            console.log('✅ Orden confirmada:', orderId);

            this.eventEmitter.emit('order.paid', orderId);

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
        console.log('📦 Suscripción creada');

        break;
      }

      case 'customer.subscription.updated':
        try {
          const stripeSub = event.data.object as Stripe.Subscription;

          console.log('📦 Evento customer.subscription.updated recibido');
          console.log('📄 Datos de la suscripción:', JSON.stringify(stripeSub, null, 2));

          const slug = stripeSub.metadata?.slug;

          if (!slug) {
            console.warn('❌ No slug in subscription metadata.');
            break;
          }

          const currentPeriodEndTimestamp = (stripeSub as any).current_period_end;

          const currentPeriodEnd = typeof currentPeriodEndTimestamp === 'number' ? new Date(currentPeriodEndTimestamp * 1000) : new Date(); // fallback si no viene bien

          if (isNaN(currentPeriodEnd.getTime())) {
            console.warn('⚠️ currentPeriodEnd es inválido, se usará la fecha actual');
          }

          const payload = {
            slug,
            stripeSubscriptionId: stripeSub.id,
            customerId: stripeSub.customer as string,
            status: stripeSub.status,
            plan: stripeSub.items.data[0]?.price.id,
            currentPeriodEnd,
            isTrial: stripeSub.trial_end != null,
            cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
          };

          console.log('📤 Emitiendo subscription.updated con payload:', payload);

          this.eventEmitter.emit('subscription.updated', payload);
        } catch (err) {
          console.error('❌ Error en customer.subscription.updated:', err);
        }
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

  async cancelStripeSubscription(stripeSubscriptionId: string): Promise<Stripe.Subscription> {
    try {
      console.log('📤 Enviando a Stripe - Cancel Subscription:', stripeSubscriptionId);

      const updated = await this.stripe.subscriptions.update(stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      console.log('📥 Respuesta de Stripe - Subscription cancelada (al final del periodo):', JSON.stringify(updated, null, 2));

      return updated;
    } catch (error) {
      console.error('❌ Error cancelling Stripe subscription:', error);
      throw new Error('Failed to cancel subscription.');
    }
  }
}
