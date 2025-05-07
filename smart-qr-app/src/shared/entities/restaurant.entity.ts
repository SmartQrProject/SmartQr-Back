import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsBoolean, IsEmail, IsString, IsUUID, Length } from 'class-validator';
import { User } from './user.entity';
import { Order } from './order.entity';
import { RestaurantTable } from './restaurant-table.entity';
import { Customer } from './customer.entity';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { RewardCode } from './reward-code.entity';

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

  @Column({ default: true })
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
}
