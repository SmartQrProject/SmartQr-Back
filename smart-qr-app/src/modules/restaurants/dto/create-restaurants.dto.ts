import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

export class CreateRestaurantsDto {
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
  @ApiProperty({
    description: 'Url for the banner of the restaurant landing page',
    example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
  })
  banner?: string;
}
