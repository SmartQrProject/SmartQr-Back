import { IsString, IsNumber, IsUUID, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
    @ApiProperty({
        description: 'Product name',
        example: 'Coca Cola',
        minLength: 2,
        maxLength: 100
    })
    @IsString()
    @Length(2, 100)
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Bebida gaseosa'
    })
    @IsString()
    description: string;

    @ApiProperty({
        description: 'Product price',
        example: 2.5
    })
    @IsNumber()
    price: number;

    @ApiProperty({
        description: 'Product image URL',
        example: 'https://example.com/image.jpg',
        required: false
    })
    @IsString()
    @IsOptional()
    image_url?: string;

    @ApiProperty({
        description: 'Category ID',
        example: '123e4567-e89b-12d3-a456-426614174000'
    })
    @IsUUID()
    categoryId: string;
}
