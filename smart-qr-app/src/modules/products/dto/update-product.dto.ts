import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({
        description: 'Sequence number for ordering',
        example: 1,
        required: false
    })
    @IsNumber()
    @IsOptional()
    sequenceNumber?: number;
}
