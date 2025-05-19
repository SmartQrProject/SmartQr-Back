import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import { Product } from '../../shared/entities/product.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly restService: RestaurantsService
  ) {}

  async create(createProductDto: CreateProductDto, slug: string): Promise<Product> {
    console.log('Creating product for slug:', slug);
    const rest = await this.restService.getRestaurants(slug);
    console.log('Found restaurant:', rest.id, rest.name);
    return await this.productsRepository.createProduct(createProductDto, rest.id);
  }

  async findAll(
    slug: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.productsRepository.findAllByRestaurant(rest.id, page, limit);
  }

  async findOne(id: string, slug: string): Promise<Product> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.productsRepository.findOneByIdAndRestaurant(id, rest.id);
  }

  async update(id: string, updateProductDto: UpdateProductDto, slug: string): Promise<Product> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.productsRepository.updateProduct(id, updateProductDto, rest.id);
  }

  async remove(id: string, slug: string): Promise<{ message: string }> {
    const rest = await this.restService.getRestaurants(slug);
    const product = await this.productsRepository.findOneByIdAndRestaurant(id, rest.id);
    await this.productsRepository.softDeleteProduct(id, rest.id);
    return { message: `Product ${product.name} has been deleted successfully` };
  }

  async updateSequences(products: { id: string, sequenceNumber: number }[], slug: string): Promise<void> {
    const rest = await this.restService.getRestaurants(slug);
    await this.productsRepository.updateProductSequences(products, rest.id);
  }
}
