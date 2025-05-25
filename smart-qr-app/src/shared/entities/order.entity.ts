import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { IsUUID, IsString, IsDecimal, Length, IsOptional, IsNumber, IsDate } from 'class-validator';
import { Customer } from './customer.entity';
import { RestaurantTable } from './restaurant-table.entity';
import { OrderItem } from './order-item.entity';
import { Restaurant } from './restaurant.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 20, default: 'pending' })
  @IsString()
  @Length(2, 20)
  status: string;

  @Column({ length: 20, default: 'unpaid' })
  @IsString()
  @Length(2, 20)
  payStatus: string;

  @Column({ length: 20, default: 'dine-in' })
  @IsString()
  order_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsDecimal()
  total_price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  @IsOptional()
  @IsString()
  payment_method?: string;

  @Column({ default: 'none' })
  @IsString()
  discount_applied: string;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  served_at?: Date;

  @ManyToOne(() => RestaurantTable, (table) => table.orders, { eager: true })
  table: RestaurantTable;

  @ManyToOne(() => Customer, (customer) => customer.orders, { eager: true })
  customer: Customer;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ default: true })
  exist: boolean;
}
