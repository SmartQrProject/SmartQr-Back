import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Category name',
    example: 'Hot Beverages',
    required: false
  })
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @ApiProperty({
    description: 'Category display order',
    example: 2,
    required: false
  })
  sequenceNumber?: number;
}
