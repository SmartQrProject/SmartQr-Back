import { PickType } from '@nestjs/swagger';
import { CompleteRestaurantsDto } from './complete-restaurants.dto';

export class CreateRestaurantsExistingDto extends PickType(CompleteRestaurantsDto, [
  'name',
  'slug',
  'owner_email',
  'isTrial',
]) {}
