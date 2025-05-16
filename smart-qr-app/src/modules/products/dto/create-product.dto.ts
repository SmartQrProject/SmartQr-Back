import { IsString, IsNumber, IsUUID, Length, IsOptional, IsNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @IsNotEmpty({ message: 'Product name is required' })
    @IsString()
    @ApiProperty({
        description: 'Product name',
        example: 'Coca Cola'
    })
    name: string;

    @IsNotEmpty({ message: 'Product price is required' })
    @IsNumber()
    @Min(0)
    @ApiProperty({
        description: 'Product price',
        example: 2.5,
        minimum: 0
    })
    price: number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Product description',
        example: 'Regular Coca Cola 355ml',
        required: false
    })
    description?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        description: 'Product image URL',
        example: 'https://example.com/images/coca-cola.jpg',
        required: false
    })
    image_url?: string;

    @IsNotEmpty({ message: 'Category ID is required' })
    @IsUUID()
    @ApiProperty({
        description: 'ID of the category this product belongs to',
        example: 'c2917676-d3d2-472a-8b7c-785f455a80ab'
    })
    categoryId: string;
}
