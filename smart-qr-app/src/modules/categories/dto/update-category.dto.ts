import { PartialType, PickType } from '@nestjs/swagger';
import { BaseCategoryDto } from './base-category.dto';

export class UpdateCategoryDto extends PartialType(PickType(BaseCategoryDto, ['name'] as const)) {}
