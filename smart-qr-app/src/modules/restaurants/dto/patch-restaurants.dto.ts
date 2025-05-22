import { IsOptional, IsString } from 'class-validator';
import { CreateRestaurantsDto } from './create-restaurants.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class PatchRestaurantsDto extends PickType(CreateRestaurantsDto, ['banner']) {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Restaurant name',
    example: 'Test Cafe',
  })
  name: string;
}
