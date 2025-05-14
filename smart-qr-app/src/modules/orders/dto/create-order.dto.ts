import {
  IsArray,
  IsInt,
  IsUUID,
  Min,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  restaurantId: string;

  @IsUUID()
  tableId: string;

  @IsOptional()
  @IsString()
  orderType?: 'dine-in' | 'pickup' | 'delivery';

  @IsOptional()
  @IsString()
  payStatus?: 'unpaid' | 'paid' | 'refunded';

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductOrderDto)
  products: ProductOrderDto[];

  @IsOptional()
  @IsString()
  rewardCode?: string;
}

export class ProductOrderDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
