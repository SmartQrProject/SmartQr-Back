import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { Category } from '../../shared/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async create(createCategoryDto: CreateCategoryDto, restaurantId: string): Promise<Category> {
    return await this.categoriesRepository.createCategory(createCategoryDto, restaurantId);
  }

  async findAll(
    restaurantId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
    return await this.categoriesRepository.findAllByRestaurant(restaurantId, page, limit);
  }

  async findOne(id: string, restaurantId: string): Promise<Category> {
    return await this.categoriesRepository.findOneByIdAndRestaurant(id, restaurantId);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, restaurantId: string): Promise<Category> {
    return await this.categoriesRepository.updateCategory(id, updateCategoryDto, restaurantId);
  }

  async remove(id: string, restaurantId: string): Promise<void> {
    await this.categoriesRepository.softDeleteCategory(id, restaurantId);
  }
}
