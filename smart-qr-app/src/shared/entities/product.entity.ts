import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsUUID,
  IsDecimal,
  Length,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Category } from './category.entity';
import { OrderItem } from './order-item.entity';
import { Restaurant } from './restaurant.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ default: 0 })
  @IsNumber()
  sequenceNumber: number;

  @Column({ length: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @Column('text')
  @IsString()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  @IsDecimal()
  price: number;

  @Column({ length: 255, nullable: true })
  @IsString()
  @IsOptional()
  image_url: string;

  @Column({ default: true })
  @IsBoolean()
  is_available: boolean;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    onDelete: 'SET NULL',
    nullable: true,
  })
  category: Category;

  @OneToMany(() => OrderItem, (item) => item.product, {
    cascade: ['insert', 'update'],
  })
  orderItems: OrderItem[];

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.products, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ default: true })
  exist: boolean;
}
