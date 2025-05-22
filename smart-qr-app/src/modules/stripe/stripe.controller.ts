import { Controller, Get, Post, Req, Res, Headers, HttpStatus, Body } from '@nestjs/common';
import { StripeService } from './stripe.service';
import Stripe from 'stripe';
import { Request, Response } from 'express';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from 'src/config/env.loader';
import { GetCheckoutSessionDoc, GetSubscriptionSessionDoc, WebhookStripeDoc } from './swagger/stripe-doc.decorator';

@Controller('stripe')
export class StripeController {
  private stripe = new Stripe(STRIPE_SECRET_KEY);

  constructor(private readonly stripeService: StripeService) {}

  @Get('checkout-session')
  @GetCheckoutSessionDoc()
  async getCheckoutSession() {
    const session = await this.stripeService.createCheckoutSession();
    return { id: session.id, url: session.url };
  }

  @Post('subscription-session')
  @GetSubscriptionSessionDoc()
  async getSubscriptionSession(@Body('slug') slug: string) {
    const session = await this.stripeService.createSubscriptionSession(slug);
    return { id: session.id, url: session.url };
  }

  @Post('webhook')
  @WebhookStripeDoc()
  async handleWebhook(@Req() req: Request, @Res() res: Response, @Headers('stripe-signature') signature: string) {
    return this.stripeService.handleWebhook(req, res, signature);
  }
}
