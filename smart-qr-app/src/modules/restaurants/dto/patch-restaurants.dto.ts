import { CreateRestaurantsDto } from './create-restaurants.dto';
import { PickType } from '@nestjs/swagger';

export class PatchRestaurantsDto extends PickType(CreateRestaurantsDto, ['name', 'banner']) {}
