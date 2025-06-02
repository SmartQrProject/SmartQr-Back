import { IsUUID, IsInt, Min, IsDecimal } from 'class-validator';

export class CreateOrderItemDto {
  @IsUUID()
  orderId: string;

  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsDecimal()
  unit_price: number;
}
