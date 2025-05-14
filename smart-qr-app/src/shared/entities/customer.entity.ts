import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  Unique,
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
@Unique(['email'])
@Unique(['auth0Id'])
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 150, nullable: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsString()
  password: string;

  @Column({ unique: true, nullable: true })
  auth0Id: string; // el campo `sub` del token
  @Column({ length: 100 })
  @Column({ default: 'local' }) // 'auth0' o 'local'
  provider: 'auth0' | 'local';

  @IsString()
  @Length(2, 100)
  name: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ length: 20 })
  @IsString()
  phone: string;

  @Column({ default: false })
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
