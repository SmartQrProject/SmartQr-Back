import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;
}

class CustomerSummaryDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;
}

export class OrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  order_type: string;

  @ApiProperty()
  tableId: string;

  @ApiProperty()
  restaurantSlug: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  total_price: number;

  @ApiProperty({ type: CustomerSummaryDto })
  customer: CustomerSummaryDto;

  @ApiProperty({ type: [OrderItemDto] })
  items: OrderItemDto[];
}
