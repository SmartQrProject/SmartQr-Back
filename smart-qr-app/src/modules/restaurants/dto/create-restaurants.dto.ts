import { PickType } from '@nestjs/swagger';
import { CompleteRestaurantsDto } from './complete-restaurants.dto';

export class CreateRestaurantsDto extends PickType(CompleteRestaurantsDto, ['name', 'slug', 'owner_name', 'owner_email', 'owner_pass', 'isTrial']) {}
