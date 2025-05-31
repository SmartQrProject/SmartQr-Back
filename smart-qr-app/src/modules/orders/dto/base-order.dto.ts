import { IsUUID, IsString, IsOptional, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProductOrderDto } from './product-order.dto';

export class BaseOrderDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({ example: 'uuid-customer-id', description: 'Customer ID' })
  customerId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ORDER1234', description: 'Unique order code' })
  code: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'dine-in', enum: ['dine-in', 'pickup', 'delivery'], required: false })
  orderType?: 'dine-in' | 'pickup' | 'delivery';

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'unpaid', enum: ['unpaid', 'paid', 'refunded'], required: false })
  payStatus?: 'unpaid' | 'paid' | 'refunded';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  @ApiProperty({
    type: [ProductOrderDto],
    description: 'List of products with quantity',
  })
  products: ProductOrderDto[];

  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'PROMO10', required: false })
  rewardCode?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'pending',
    enum: ['pending', 'in-process', 'ready', 'completed'],
    required: false,
  })
  status: 'pending' | 'in-process' | 'ready' | 'completed';
}
