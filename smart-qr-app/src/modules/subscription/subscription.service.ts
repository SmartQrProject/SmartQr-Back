import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from 'src/shared/entities/subscription.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

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
}
