import { IsDateString, IsOptional, IsIn } from 'class-validator';

export class GetSalesByCategoryDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sort?: 'asc' | 'desc';
}
