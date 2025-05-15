import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from '../../shared/entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../../shared/entities/category.entity';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {}

    async createProduct(createProductDto: CreateProductDto, restaurantId: string): Promise<Product> {
        const category = await this.categoryRepository.findOne({
            where: {
                id: createProductDto.categoryId,
                restaurant: { id: restaurantId },
                exist: true
            }
        });

        if (!category) {
            throw new BadRequestException('La categoría no existe o no pertenece a este restaurante');
        }

        const product = this.productRepository.create({
            ...createProductDto,
            image_url: createProductDto.image_url || 'https://via.placeholder.com/150',
            restaurant: { id: restaurantId },
            category: { id: createProductDto.categoryId }
        });
        return await this.productRepository.save(product);
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto, restaurantId: string): Promise<Product> {
        const product = await this.findOneByIdAndRestaurant(id, restaurantId);
        
        const updatedProduct = this.productRepository.merge(product, updateProductDto);
        
        return await this.productRepository.save(updatedProduct);
    }

    async findAllByRestaurant(
        restaurantId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
        const skip = (page - 1) * limit;
        const [products, total] = await this.productRepository.findAndCount({
            where: { restaurant: { id: restaurantId }, exist: true },
            relations: ['category'],
            order: { sequenceNumber: 'ASC' },
            skip,
            take: limit
        });

        if (!products.length) {
            throw new NotFoundException(`No products found for restaurant ${restaurantId}`);
        }

        return { products, total, page, limit };
    }

    async findOneByIdAndRestaurant(id: string, restaurantId: string): Promise<Product> {
        const product = await this.productRepository.findOne({
            where: { 
                id, 
                exist: true,
                restaurant: { id: restaurantId }
            },
            relations: ['category']
        });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found in this restaurant`);
        return product;
    }

    async softDeleteProduct(id: string, restaurantId: string): Promise<void> {
        const product = await this.findOneByIdAndRestaurant(id, restaurantId);
        product.exist = false;
        await this.productRepository.save(product);
    }

    async updateProductSequences(products: { id: string, sequenceNumber: number }[], restaurantId: string): Promise<void> {
        const existingProducts = await this.productRepository.find({
            where: { 
                id: In(products.map(p => p.id)),
                restaurant: { id: restaurantId },
                exist: true
            }
        });

        if (existingProducts.length !== products.length) {
            throw new NotFoundException('Some products were not found or do not belong to this restaurant');
        }

        await Promise.all(products.map(update => 
            this.productRepository.update(
                { id: update.id, restaurant: { id: restaurantId } },
                { sequenceNumber: update.sequenceNumber }
            )
        ));
    }
} 