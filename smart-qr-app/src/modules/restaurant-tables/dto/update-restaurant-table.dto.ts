import { PickType } from '@nestjs/swagger';
import { CreateRestaurantTableDto } from './create-restaurant-table.dto';
import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateRestaurantTableDto extends PickType(CreateRestaurantTableDto, ['is_active', 'exist'] as const) {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Matches(/^[A-Za-z0-9 \-]+$/, {
    message: 'This field only permits letters, numbers, spaces, and hyphens.',
  })
  @ApiPropertyOptional({
    description: 'The Table-Code must have between 5 and 100 characters',
    example: 'T001',
  })
  code?: string;
}
