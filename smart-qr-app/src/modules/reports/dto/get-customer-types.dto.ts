import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCustomerTypesDto {
  @ApiProperty({
    description: 'Start date of the range (inclusive)',
    example: '2025-05-01',
  })
  @IsDateString()
  from: string;

  @ApiProperty({
    description: 'End date of the range (inclusive)',
    example: '2025-05-20',
  })
  @IsDateString()
  to: string;
}
