import { IsDateString } from 'class-validator';

export class GetSalesDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
