import { IsBoolean, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BaseRestaurantTableDto {
  @IsString({
    message: 'The Table-Code is mandatory and must have between 1 and 15 characters',
  })
  @Length(1, 15, {
    message: 'The Table-Code must have between 1 and 15 characters',
  })
  @Matches(/^[A-Za-z0-9 \-]+$/, {
    message: 'This field only permits letters, numbers, spaces, and hyphens.',
  })
  @IsOptional()
  @ApiPropertyOptional({
    description: 'The Table-Code must have between 1 and 15 characters',
    example: 'T-01',
  })
  code?: string;

  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Indicates if the Table is temporarily available to be used. True or False.',
    type: Boolean,
    default: true,
  })
  is_active?: boolean;
}
