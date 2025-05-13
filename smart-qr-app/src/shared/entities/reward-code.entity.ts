import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import {
  IsString,
  IsBoolean,
  IsInt,
  IsUUID,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Restaurant } from './restaurant.entity';

@Entity('reward_code')
export class RewardCode {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 50 })
  @IsString()
  @Length(4, 50)
  code: string;

  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  @Column('int')
  @IsInt()
  @Min(1)
  @Max(100)
  percentage: number;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.rewardCodes, {
    onDelete: 'CASCADE',
  })
  restaurant: Restaurant;
}
