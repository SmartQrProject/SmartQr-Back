import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { IsUUID, IsString, IsDecimal, Length } from 'class-validator';
import { Customer } from './customer.entity';
import { RestaurantTable } from './restaurant-table.entity';
import { OrderItem } from './order-item.entity';
import { Restaurant } from './restaurant.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 20 })
  @IsString()
  @Length(2, 20)
  status: string;

  @Column({ length: 20 })
  @IsString()
  @Length(2, 20)
  payStatus: string;

  @Column({ length: 20 })
  @IsString()
  order_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsDecimal()
  total_price: number;

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
}
