import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty({
        description: 'The sequence number for ordering categories',
        required: false,
        minimum: 0,
        example: 1
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    sequenceNumber?: number;
}
