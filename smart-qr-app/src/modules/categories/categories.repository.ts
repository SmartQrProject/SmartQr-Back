import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Category } from '../../shared/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository extends Repository<Category> {
    constructor(private dataSource: DataSource) {
        super(Category, dataSource.createEntityManager());
    }

    async createCategory(createCategoryDto: CreateCategoryDto, restaurantId: string): Promise<Category> {
        const category = this.create({
            ...createCategoryDto,
            restaurant: { id: restaurantId }
        });
        return await this.save(category);
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, restaurantId: string): Promise<Category> {
        const category = await this.findOneByIdAndRestaurant(id, restaurantId);
        await this.update(id, updateCategoryDto);
        return await this.findOneByIdAndRestaurant(id, restaurantId);
    }

    async findAllByRestaurant(
        restaurantId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const [categories, total] = await this.findAndCount({
            where: { restaurant: { id: restaurantId }, exist: true },
            relations: ['products'],
            order: { sequenceNumber: 'ASC' },
            skip,
            take: limit
        });

        if (!categories.length) {
            throw new NotFoundException(`No categories found for restaurant ${restaurantId}`);
        }

        return { categories, total, page, limit };
    }

    async findOneByIdAndRestaurant(id: string, restaurantId: string): Promise<Category> {
        const category = await this.findOne({
            where: { 
                id, 
                exist: true,
                restaurant: { id: restaurantId }
            },
            relations: ['products']
        });
        if (!category) throw new NotFoundException(`Category with ID ${id} not found in this restaurant`);
        return category;
    }

    async softDeleteCategory(id: string, restaurantId: string): Promise<void> {
        const category = await this.findOneByIdAndRestaurant(id, restaurantId);
        await this.update(id, { exist: false });
    }
} 