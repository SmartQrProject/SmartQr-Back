import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSalesFrequencyDto {
  @ApiProperty({
    enum: ['hour', 'weekday', 'monthday', 'month'],
    description: 'Unidad de agrupamiento de las ventas',
    example: 'hour',
  })
  @IsIn(['hour', 'weekday', 'monthday', 'month'])
  group: string;
}
