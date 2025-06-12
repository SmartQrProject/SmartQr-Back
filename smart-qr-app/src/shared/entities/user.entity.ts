import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { IsEmail, IsString, IsUUID, Length } from 'class-validator';
import { Restaurant } from './restaurant.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  @Column({ length: 100 })
  @IsString()
  @Length(5, 100)
  name: string;

  @Column({ length: 150 })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @Length(6, 100)
  password: string;

  @Column({ length: 20, default: 'staff' })
  @IsString()
  role: string; // 'superAdmin', 'owner', 'staff'

  @Column({ nullable: true, length: 20 })
  @IsString()
  @Length(5, 20)
  phone?: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ default: true })
  exist: boolean;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => Restaurant, (restaurant) => restaurant.users, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_restaurants',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'restaurantId', referencedColumnName: 'id' },
  })
  restaurants: Restaurant[];
}
