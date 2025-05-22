import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCustomerTypesDto {
  @ApiProperty({
    description: 'Fecha de inicio del rango (inclusive)',
    example: '2025-05-01',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    description: 'Fecha de fin del rango (inclusive)',
    example: '2025-05-20',
  })
  @IsDateString()
  to: string;
}
