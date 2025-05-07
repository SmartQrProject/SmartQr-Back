import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IsEmail, IsString, IsUUID, Length } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(2, 100)
  name: string;

  @Column({ unique: true, length: 150 })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(6, 100)
  password: string;

  @Column({ length: 20 })
  @IsString()
  role: string; // 'owner', 'admin', 'kitchen'

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.users, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
