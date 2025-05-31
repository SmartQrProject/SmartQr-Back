import { PickType } from '@nestjs/swagger';
import { BaseProductDto } from './base-product.dto';

export class CreateProductDto extends PickType(BaseProductDto, ['name', 'price', 'description', 'image_url', 'details', 'categoryId', 'is_available'] as const) {}
