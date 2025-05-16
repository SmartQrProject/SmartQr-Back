import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsString, IsBoolean, IsUUID, Length } from 'class-validator';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';

@Entity('restaurant_tables')
export class RestaurantTable {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ unique: true, length: 50 })
  @IsString()
  @Length(1, 50)
  code: string;

  @Column({ default: true })
  @IsBoolean()
  is_active: boolean;

  @Column({ default: true })
  exist: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.tables, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
