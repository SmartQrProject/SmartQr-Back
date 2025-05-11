import { Injectable } from '@nestjs/common';
import {
  FRONTEND_URL,
  STRIPE_PRICE_ID,
  STRIPE_SECRET_KEY,
} from 'src/config/env.loader';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(STRIPE_SECRET_KEY);

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
  async createSubscriptionSession(): Promise<Stripe.Checkout.Session> {
    return await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });
  }
}
