import { Injectable, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { Category } from '../../shared/entities/category.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { SequenceUpdateException } from '../../common/exceptions/sequence-update.exception';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly restService: RestaurantsService
  ) {}

  async create(createCategoryDto: CreateCategoryDto, slug: string): Promise<Category> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.categoriesRepository.createCategory(createCategoryDto, rest.id);
  }

  async findAll(
    slug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.categoriesRepository.findAllByRestaurant(rest.id, page, limit);
  }

  async findOne(id: string, slug: string): Promise<Category> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.categoriesRepository.findOneByIdAndRestaurant(id, rest.id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, slug: string): Promise<Category> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.categoriesRepository.updateCategory(id, updateCategoryDto, rest.id);
  }

  async remove(id: string, slug: string): Promise<void> {
    const rest = await this.restService.getRestaurants(slug);
    await this.categoriesRepository.softDeleteCategory(id, rest.id);
  }

  async updateSequences(categories: { id: string, sequenceNumber: number }[], slug: string): Promise<{ message: string }> {
    try {
      const rest = await this.restService.getRestaurants(slug);
      await this.categoriesRepository.updateCategorySequences(categories, rest.id);
      return { message: 'Category sequences have been updated successfully' };
    } catch (error) {
      if (error instanceof SequenceUpdateException) {
        throw error;
      }
      throw new SequenceUpdateException(
        'Failed to update category sequences. Please ensure all category IDs are valid and try again.'
      );
    }
  }
}
