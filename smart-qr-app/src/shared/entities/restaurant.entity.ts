import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne, JoinColumn } from 'typeorm';
import { IsArray, IsBoolean, IsEmail, IsObject, IsOptional, IsString, IsUUID, Length } from 'class-validator';
import { User } from './user.entity';
import { Order } from './order.entity';
import { RestaurantTable } from './restaurant-table.entity';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { RewardCode } from './reward-code.entity';
import { Subscription } from './subscription.entity';

export interface TradingHours {
  mondayToFriday: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface OrderingTimes {
  pickup: string;
  dinein: string;
}

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @Column({ unique: true, length: 100 })
  @IsString()
  @Length(2, 100)
  slug: string;

  @Column({ length: 150 })
  @IsEmail()
  owner_email: string;

  @Column({ default: false })
  @IsBoolean()
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => User, (user) => user.restaurant, { cascade: true })
  users: User[];

  @OneToMany(() => Order, (order) => order.restaurant)
  orders: Order[];

  @OneToMany(() => RestaurantTable, (table) => table.restaurant)
  tables: RestaurantTable[];

  @OneToMany(() => Customer, (customer) => customer.restaurant)
  customers: Customer[];

  @OneToMany(() => Product, (product) => product.restaurant)
  products: Product[];

  @OneToMany(() => Category, (category) => category.restaurant)
  categories: Category[];

  @OneToMany(() => RewardCode, (code) => code.restaurant)
  rewardCodes: RewardCode[];

  @OneToOne(() => Subscription, (subscription) => subscription.restaurant, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  subscription: Subscription;

  @Column({ default: true })
  exist: boolean;

  @Column({
    default: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
  })
  banner: string;

  @Column({ nullable: true })
  @IsOptional()
  address: string;

  @Column({ nullable: true })
  @IsOptional()
  phone: string;

  @Column({ type: 'text', nullable: true })
  @IsOptional()
  description: string;

  @Column('text', { array: true, nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsObject()
  trading_hours: TradingHours;

  @Column({ type: 'jsonb', nullable: true })
  @IsOptional()
  @IsObject()
  ordering_times: OrderingTimes;
}
