import { IsOptional, IsString } from 'class-validator';
import { CompleteRestaurantsDto } from './complete-restaurants.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class CreateRestaurantsDto extends PickType(CompleteRestaurantsDto, ['name', 'slug', 'owner_email', 'owner_pass', 'banner']) {}
