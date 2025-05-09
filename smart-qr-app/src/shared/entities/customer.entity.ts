import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  IsString,
  IsEmail,
  IsUUID,
  IsBoolean,
  IsInt,
  Length,
  Min,
} from 'class-validator';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @Column({ length: 150 })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  password: string;

  @Column({ length: 20 })
  @IsString()
  phone: string;

  @Column({ default: true })
  @IsBoolean()
  is_guest: boolean;

  @Column('int', { default: 0 })
  @IsInt()
  @Min(0)
  reward: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Order, (order) => order.customer, { cascade: true })
  orders: Order[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.customers, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
