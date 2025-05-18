import { IsString, IsNumber, IsUUID, Length, IsOptional, IsNotEmpty, Min, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString()
  @ApiProperty({
    description: 'Product name',
    example: 'Coca Cola',
  })
  name: string;

  @Type(() => Number)
  @IsNotEmpty({ message: 'Product price is required' })
  @IsNumber()
  @Min(0)
  @ApiProperty({
    description: 'Product price',
    example: 2.5,
    minimum: 0,
  })
  price: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Product description',
    example: 'Regular Coca Cola 355ml',
    required: false,
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Product image URL',
    example: 'https://example.com/images/coca-cola.jpg',
    required: false,
  })
  image_url?: string;

  @IsNotEmpty({ message: 'Category ID is required' })
  @IsUUID()
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

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'Custom sequence number for sorting products',
    example: 10,
    required: false,
  })
  sequenceNumber?: number;
}
