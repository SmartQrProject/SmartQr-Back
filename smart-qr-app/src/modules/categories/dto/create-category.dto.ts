import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @IsNotEmpty({ message: 'Category name is required' })
    @IsString({ message: 'Name must be a string' })
    @ApiProperty({
        description: 'Category name',
        example: 'Beverages',
        required: true
    })
    name: string;
}
