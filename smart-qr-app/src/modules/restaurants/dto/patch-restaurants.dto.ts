import { IsOptional, IsString } from 'class-validator';
import { CompleteRestaurantsDto } from './complete-restaurants.dto';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class PatchRestaurantsDto extends PartialType(
  PickType(CompleteRestaurantsDto, [
    'name',
    'banner',
    'address',
    'phone',
    'description',
    'tags',
    'subscriptionId',
    'trading_hours',
    'ordering_times',
    'isTrial',
    'longitude',
    'latitude',
    'is_active',
    'exist',
  ]),
) {}
