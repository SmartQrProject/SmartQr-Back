import { Injectable, NotFoundException } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/shared/entities/subscription.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { StripeService } from '../stripe/stripe.service';

interface SubscriptionPaidEvent {
  slug: string;
  stripeSubscriptionId: string;
  customerId: string;
  status: string;
  plan: string;
  currentPeriodEnd: Date;
  isTrial: boolean;
}

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    private readonly stripeService: StripeService,
  ) {}

  @OnEvent('subscription.paid')
  async handleSubscriptionPaid(event: SubscriptionPaidEvent) {
    console.log('📩 Recibido evento de suscripción pagada:', event);

    const restaurant = await this.restaurantRepo.findOne({
      where: { slug: event.slug },
    });

    if (!restaurant) {
      console.warn(`❌ Restaurante con slug '${event.slug}' no encontrado.`);
      return;
    }

    // Buscar si ya existe una suscripción vinculada a ese restaurante
    const existing = await this.subscriptionRepo.findOne({
      where: { restaurant: { id: restaurant.id } },
      relations: ['restaurant'],
    });

    if (existing) {
      existing.status = event.status;
      existing.plan = event.plan;
      existing.currentPeriodEnd = event.currentPeriodEnd;
      existing.isTrial = event.isTrial;
      await this.subscriptionRepo.save(existing);
      console.log('🔁 Suscripción actualizada');
    } else {
      const newSub = this.subscriptionRepo.create({
        stripeSubscriptionId: event.stripeSubscriptionId,
        customerId: event.customerId,
        status: event.status,
        plan: event.plan,
        currentPeriodEnd: event.currentPeriodEnd,
        restaurant: restaurant,
        isTrial: event.isTrial,
        exist: true,
      });
      await this.subscriptionRepo.save(newSub);
      console.log('✅ Nueva suscripción registrada');
    }
  }

  async cancelSubscription(slug: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepo.findOne({
      where: { restaurant: { slug } },
      relations: ['restaurant'],
    });

    if (!subscription || !subscription.stripeSubscriptionId) {
      throw new Error('Subscription not found.');
    }

    await this.stripeService.cancelStripeSubscription(subscription.stripeSubscriptionId);

    return subscription;
  }

  @OnEvent('subscription.updated')
  async updateFromStripe(data: {
    slug: string;
    stripeSubscriptionId: string;
    customerId: string;
    status: string;
    plan: string;
    currentPeriodEnd: Date;
    isTrial: boolean;
    cancelAtPeriodEnd: boolean;
  }) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { restaurant: { slug: data.slug } },
      relations: ['restaurant'],
    });

    if (!subscription) return;

    subscription.status = data.status;
    subscription.customerId = data.customerId;
    subscription.plan = data.plan;
    subscription.currentPeriodEnd = data.currentPeriodEnd;
    subscription.isTrial = data.isTrial;
    subscription.cancelAtPeriodEnd = data.cancelAtPeriodEnd;

    await this.subscriptionRepo.save(subscription);
  }

  async getByRestaurantSlug(slug: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: {
        restaurant: { slug },
      },
      relations: ['restaurant'],
    });

    if (!subscription) return null;

    return {
      subscriptionId: subscription.id,
      stripeSubscriptionId: subscription.stripeSubscriptionId,
      customerStripeId: subscription.customerId,
      status: subscription.status,
      planStripeId: subscription.plan,
      currentPeriodEnd: subscription.currentPeriodEnd,
      createdAt: subscription.createdAt,
      isTrial: subscription.isTrial,
      cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
      restaurantName: subscription.restaurant?.name,
      ownerEmail: subscription.restaurant?.owner_email,
    };
  }
}
