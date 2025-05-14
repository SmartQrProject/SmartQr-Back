import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
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

  @Column({ nullable: true })
  auth0Id: string; // el campo `sub` del token

  @Column({ length: 150 })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsString()
  @Length(2, 100)
  name: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ nullable: true })
  @IsString()
  password: string;

  @Column({ length: 20, nullable: true })
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

  @UpdateDateColumn()
  modified_at: Date;

  @OneToMany(() => Order, (order) => order.customer, { cascade: true })
  orders: Order[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.customers, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ default: true })
  exist: boolean;
}
