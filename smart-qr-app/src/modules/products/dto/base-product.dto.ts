import { IsString, IsNumber, IsUUID, IsOptional, IsNotEmpty, Min, IsBoolean, Length, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BaseProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Product name is required' })
  @Length(2, 30, { message: 'Product name must be between 2 and 30 characters' })
  @ApiProperty({ description: 'Product name', example: 'Coca Cola', minLength: 2, maxLength: 30 })
  name: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Price must be a number with up to 2 decimal places' })
  @Min(0, { message: 'Price must be at least 0' })
  @Max(99999999.99, { message: 'Price must not exceed 99,999,999.99' })
  @IsNotEmpty({ message: 'Product price is required' })
  @ApiProperty({
    description: 'Product price (0 – 99,999,999.99) with up to 2 decimal places',
    example: 2.5,
    minimum: 0,
    maximum: 99999999.99,
  })
  price: number;

  @IsOptional()
  @IsString()
  @Length(5, 100, { message: 'Description must be up to 100 characters' })
  @ApiProperty({
    description: 'Product description',
    example: 'Regular Coca Cola 355ml',
    maxLength: 100,
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @Length(0, 255, { message: 'Image URL must be up to 255 characters' })
  @ApiProperty({
    description: 'Product image URL',
    example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1748645172/citdvjdupzwjututazzu.webp',
    maxLength: 255,
    required: false,
  })
  image_url?: string;

  @IsOptional()
  @IsString({ each: true })
  @Length(1, 20, { each: true, message: 'Each detail must be between 1 and 20 characters' })
  @ApiProperty({
    description: 'Optional product details like dietary tags or labels',
    example: ['vegan', 'gluten-free', 'lactose-free'],
    isArray: true,
    type: String,
    required: false,
  })
  details?: string[];

  @IsUUID()
  @IsNotEmpty({ message: 'Category ID is required' })
  @ApiProperty({
    description: 'ID of the category this product belongs to',
    example: 'd8737e33-4d0d-49eb-ad10-b2a1d3489666',
  })
  categoryId: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Whether the product is available for ordering',
    example: true,
    required: false,
  })
  is_available?: boolean;
}
