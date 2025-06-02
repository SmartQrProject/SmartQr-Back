import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductOrderDto {
  @IsUUID()
  @ApiProperty({ example: 'uuid-product-id', description: 'Product ID' })
  id: string;

  @IsInt()
  @Min(1)
  @ApiProperty({ example: 2, description: 'Quantity of product' })
  quantity: number;
}
