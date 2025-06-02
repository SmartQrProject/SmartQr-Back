import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsString, IsUUID, Length } from 'class-validator';
import { Product } from './product.entity';
import { Restaurant } from './restaurant.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'int', default: 0 })
  sequenceNumber: number;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.categories, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;

  @Column({ default: true })
  exist: boolean;
}
