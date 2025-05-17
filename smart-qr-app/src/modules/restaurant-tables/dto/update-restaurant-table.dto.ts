import { PickType } from '@nestjs/swagger';
import { CreateRestaurantTableDto } from './create-restaurant-table.dto';

export class UpdateRestaurantTableDto extends PickType(
  CreateRestaurantTableDto,
  ['code', 'is_active', 'exist'],
) {}
