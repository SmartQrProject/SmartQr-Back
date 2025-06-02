import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsNumberString } from 'class-validator';

export class GetCustomersReportDto {
  @ApiProperty({ example: 'orders', required: false })
  @IsOptional()
  @IsIn(['name', 'email', 'orders', 'totalSpent', 'averageOrder', 'createdAt', 'lastVisit', 'daysSince'])
  sortBy?: string = 'orders';

  @ApiProperty({ example: 'desc', required: false })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';

  @ApiProperty({ example: '10', required: false })
  @IsOptional()
  @IsNumberString()
  limit?: string = '10';

  @ApiProperty({ example: '1', required: false })
  @IsOptional()
  @IsNumberString()
  page?: string = '1';
}
