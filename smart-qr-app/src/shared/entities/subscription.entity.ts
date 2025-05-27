import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stripeSubscriptionId: string;

  @Column()
  customerId: string;

  @Column()
  status: string; // active, incomplete, canceled, etc.

  @Column()
  plan: string;

  @Column({ type: 'timestamp' })
  currentPeriodEnd: Date;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Restaurant, (restaurant) => restaurant.subscription)
  restaurant: Restaurant;

  @Column({ default: true })
  exist: boolean;

  @Column({ default: false })
  isTrial: boolean;
}
