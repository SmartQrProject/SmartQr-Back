import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsArray,
  IsObject,
  IsBoolean,
  Length,
  Matches,
  ArrayMinSize,
  ArrayMaxSize,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export interface TradingHours {
  mondayToFriday: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface OrderingTimes {
  pickup: string;
  dinein: string;
}

export class CompleteRestaurantsDto {
  @IsNotEmpty({ message: 'Restaurant name is required' })
  @IsString()
  @Length(1, 50, { message: 'Restaurant name must be between 1 and 50 characters' })
  @ApiProperty({
    description: 'Restaurant name (must be between 1 and 50 characters)',
    example: 'Test Cafe',
    minLength: 1,
    maxLength: 50,
  })
  name: string;

  @IsNotEmpty({ message: 'Owner name is required' })
  @IsString()
  @Length(5, 50, { message: 'Owner name must be between 5 and 50 characters' })
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'THis field only permits letters and numbers and spaces.',
  })
  @ApiProperty({
    description: 'Full name of the restaurant owner (5 to 50 characters)',
    example: 'John Smith',
    minLength: 5,
    maxLength: 50,
  })
  owner_name: string;

  @IsNotEmpty({ message: 'Restaurant slug is required' })
  @IsString()
  @Length(5, 15, { message: 'Slug must be between 5 and 15 characters' })
  @ApiProperty({
    description: 'Unique restaurant slug/endpoint (lowercase, hyphens, no spaces, 5–15 characters)',
    example: 'test-cafe',
    minLength: 5,
    maxLength: 15,
  })
  slug: string;

  @IsNotEmpty({
    message: 'Owner email is required',
  })
  @IsEmail()
  @Length(5, 100, { message: 'Owner email must be between 5 and 100 characters' })
  @ApiProperty({
    description: 'Restaurant owner email',
    example: 'smartqr2@gmail.com',
  })
  owner_email: string;

  @IsNotEmpty({ message: 'Owner password is required' })
  @IsString()
  @Length(8, 15, {
    message: 'Password must be between 8 and 15 characters',
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/, {
    message: 'Password must be 8–15 characters and include uppercase, lowercase, number, and special character (@$!%*?&)',
  })
  @ApiProperty({
    description: 'Restaurant owner password (8–15 characters, must include uppercase, lowercase, number, and a special character)',
    example: '!Example123',
    minLength: 8,
    maxLength: 15,
  })
  owner_pass: string;

  @IsUrl()
  @IsOptional()
  @Length(0, 255, { message: 'Image URL must be up to 255 characters' })
  @ApiPropertyOptional({
    description: 'Url for the banner of the restaurant landing page',
    example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
  })
  banner?: string;

  @IsOptional()
  @Length(5, 255, {
    message: 'The address must be between 5 and 255 characters',
  })
  @IsString()
  @ApiPropertyOptional({
    description: 'Full address of the restaurant',
    example: 'Belgrano 870, Venado Tuerto, 2600, Santa Fe, Argentina',
  })
  address?: string;

  @IsOptional()
  @Length(6, 40, {
    message: 'The phone number must be between 6 and 40 characters',
  })
  @IsString()
  @ApiPropertyOptional({
    description: 'Phone number +countryCode Area Code, Number',
    example: '+54 93487 424050',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Length(3, 255, {
    message: 'The description must be between 3 and 200 characters',
  })
  @ApiPropertyOptional({
    description: 'Describe your business',
    example: 'Healthies Meals',
    minLength: 3,
    maxLength: 255,
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Describe your restaurant using tags',
    example: ['vegan', 'specialties', 'gourmet'],
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Trading schedule (JSON type structure)',
    type: Object,
    example: {
      mondayToFriday: { open: '09:00', close: '18:00' },
      saturday: { open: '10:00', close: '14:00' },
    },
  })
  @IsOptional()
  @IsObject()
  trading_hours?: TradingHours;

  @ApiPropertyOptional({
    description: 'Ordering schedule (JSON type structure)',
    type: Object,
    example: {
      mondayToFriday: { open: '11:00', close: '22:00' },
      saturday: { open: '11:00', close: '14:00' },
    },
  })
  @IsOptional()
  @IsObject()
  ordering_times?: OrderingTimes;

  @ApiPropertyOptional({
    description: 'Indica si el restaurante debe comenzar con un periodo de prueba (trial)',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isTrial?: boolean;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Restaurant latitude',
    example: -34.603722,
  })
  @Type(() => Number)
  @IsLatitude()
  latitude?: number;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Restaurant longitude',
    example: -58.381592,
  })
  @Type(() => Number)
  @IsLongitude()
  longitude?: number;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Bollean Activo o Desactivado',
    example: true,
  })
  is_active?: boolean;
}
