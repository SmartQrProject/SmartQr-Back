import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne, UpdateDateColumn } from 'typeorm';
import { IsString, IsEmail, IsUUID, IsBoolean, IsInt, Length, Min, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Order } from './order.entity';
import { Restaurant } from './restaurant.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ unique: true, nullable: true })
  auth0Id: string; // el campo `sub` del token

  @Column({ length: 150 })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  @IsString()
  @Length(2, 100)
  name: string;

  @Column({ nullable: true })
  @IsString()
  picture: string;

  @Column({ nullable: true })
  @IsString()
  password: string;

  @Column({ length: 20, nullable: true })
  @IsString()
  phone: string;

  @Column('int', { default: 0 })
  @IsInt()
  @Min(0)
  reward: number;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  last_visit?: Date;

  @Column({ type: 'int', default: 0 })
  @IsNumber()
  visits_count: number;

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
