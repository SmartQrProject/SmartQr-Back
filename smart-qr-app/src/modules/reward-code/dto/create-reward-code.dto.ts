import { IsInt, Max, Min } from 'class-validator';

export class CreateRewardCodeDto {
  @IsInt()
  @Min(1)
  @Max(100)
  percentage: number;
}
