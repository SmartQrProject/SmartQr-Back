import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, EntityManager } from 'typeorm';
import { Category } from '../../shared/entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        private readonly entityManager: EntityManager
    ) {}

    private async validateCategoryName(name: string, restaurantId: string): Promise<void> {
        const existingCategory = await this.categoryRepository.findOne({
            where: {
                name: name,
                restaurant: { id: restaurantId },
                exist: true
            }
        });

        if (existingCategory) {
            throw new ConflictException(`Ya existe una categoría con el nombre "${name}" en este restaurante`);
        }
    }

    async createCategory(createCategoryDto: CreateCategoryDto, restaurantId: string): Promise<Category> {
        // Usamos una transacción con el EntityManager
        return await this.entityManager.transaction(async transactionalEntityManager => {
            // Validamos el nombre antes de cualquier operación
            await this.validateCategoryName(createCategoryDto.name, restaurantId);

            // Creamos la categoría dentro de la transacción
            const category = this.categoryRepository.create({
                ...createCategoryDto,
                restaurant: { id: restaurantId }
            });

            return await transactionalEntityManager.save(Category, category);
        });
    }

    async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto, restaurantId: string): Promise<Category> {
        return await this.entityManager.transaction(async transactionalEntityManager => {
            const category = await this.findOneByIdAndRestaurant(id, restaurantId);
            
            // Si se está actualizando el nombre, validamos que no exista
            if (updateCategoryDto.name) {
                await this.validateCategoryName(updateCategoryDto.name, restaurantId);
            }
            
            const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
            return await transactionalEntityManager.save(Category, updatedCategory);
        });
    }

    async findAllByRestaurant(
        restaurantId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const [categories, total] = await this.categoryRepository.findAndCount({
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
        const category = await this.categoryRepository.findOne({
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
        category.exist = false;
        await this.categoryRepository.save(category);
    }

    async updateCategorySequences(categories: { id: string, sequenceNumber: number }[], restaurantId: string): Promise<void> {
        const existingCategories = await this.categoryRepository.find({
            where: { 
                id: In(categories.map(c => c.id)),
                restaurant: { id: restaurantId },
                exist: true
            }
        });

        if (existingCategories.length !== categories.length) {
            throw new NotFoundException('Some categories were not found or do not belong to this restaurant');
        }

        await Promise.all(categories.map(update => 
            this.categoryRepository.update(
                { id: update.id, restaurant: { id: restaurantId } },
                { sequenceNumber: update.sequenceNumber }
            )
        ));
    }
} 