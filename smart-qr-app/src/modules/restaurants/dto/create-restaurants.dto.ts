import { IsOptional } from 'class-validator';
import { CompleteRestaurantsDto } from './complete-restaurants.dto';
import { ApiPropertyOptional, PickType } from '@nestjs/swagger';

export class CreateRestaurantsDto extends PickType(CompleteRestaurantsDto, [
  'name',
  'slug',
  'owner_email',
  'isTrial',
]) {
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Full name of the restaurant owner (5 to 50 characters)',
    example: 'John Smith',
  })
  owner_name?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Owner password (8–15 characters with uppercase, lowercase, number and special character)',
    example: '!Example123',
  })
  owner_pass?: string;
}
