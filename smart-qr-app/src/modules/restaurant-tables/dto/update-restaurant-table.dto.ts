import { PartialType } from '@nestjs/swagger';
import { BaseRestaurantTableDto } from './base-restaurant-table.dto';

export class UpdateRestaurantTableDto extends PartialType(BaseRestaurantTableDto) {}
