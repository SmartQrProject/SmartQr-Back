import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'The name of the category',
        minLength: 2,
        maxLength: 100,
        example: 'Bebidas'
    })
    @IsString()
    @Length(2, 100)
    name: string;
}
