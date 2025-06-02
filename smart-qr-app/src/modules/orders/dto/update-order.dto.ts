import { PickType } from '@nestjs/swagger';
import { BaseOrderDto } from './base-order.dto';

export class UpdateOrderDto extends PickType(BaseOrderDto, ['status'] as const) {}
