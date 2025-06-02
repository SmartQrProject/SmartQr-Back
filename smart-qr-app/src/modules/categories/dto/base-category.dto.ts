import { IsString, Length, IsOptional, IsNumber, Min, IsBoolean, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BaseCategoryDto {
  @IsString({ message: 'Name must be a string' })
  @Length(2, 30, { message: 'Name must be between 2 and 30 characters' })
  @IsNotEmpty({ message: 'Name cannot be empty' })
  @ApiProperty({
    description: 'Category name',
    example: 'Beverages',
  })
  name: string;
}
