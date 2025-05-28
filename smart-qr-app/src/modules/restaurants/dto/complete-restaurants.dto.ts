import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsUrl, IsOptional, IsArray, IsObject, IsBoolean } from 'class-validator';

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
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Test Cafe',
  })
  name: string;

  @IsNotEmpty({ message: 'Restaurant slug is required' })
  @IsString()
  @ApiProperty({
    description: 'Unique restaurant slug/endpoint (lowercase, hyphens, no spaces)',
    example: 'test-cafe',
  })
  slug: string;

  @IsNotEmpty({
    message: 'Owner email is required',
  })
  @IsEmail()
  @ApiProperty({
    description: 'Restaurant owner email',
    example: 'smartqr2@gmail.com',
  })
  owner_email: string;

  @IsNotEmpty({
    message: 'Owner password is required',
  })
  @IsString()
  @ApiProperty({
    description: 'Restaurant owner password (min 8 chars, must include uppercase, lowercase and numbers)',
    example: '!Example123',
  })
  owner_pass: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Url for the banner of the restaurant landing page',
    example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
  })
  banner?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Full address of the restaurant',
    example: 'Belgrano 870, Venado Tuerto, 2600, Santa Fe, Argentina',
  })
  address?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Phone number +countryCode Area Code, Number',
    example: '+54 93487 424050',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Describe your bussiness',
    example: 'Healthies Meals',
  })
  description?: string;

  @ApiPropertyOptional({
    description: 'Describe in Tags your restaurant',
    example: ['vegan', 'specialties', 'gourmet'],
    type: String,
    isArray: true,
  })
  @IsOptional()
  @IsArray()
  tags?: string;

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
}
