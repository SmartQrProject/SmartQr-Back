import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../shared/entities/product.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateProductDoc, GetAllProductsDoc, GetProductByIdDoc, UpdateProductDoc, DeleteProductDoc, UpdateProductSequencesDoc } from './swagger/products.decorator';

@ApiTags('products')
@ApiBearerAuth()
@Controller(':slug/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @CreateProductDoc()
  async create(@Param('slug') slug: string, @Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto, slug);
  }

  @Get()
  @GetAllProductsDoc()
  async findAll(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
  }> {
    return await this.productsService.findAll(slug, page, limit);
  }

  @Get(':id')
  @GetProductByIdDoc()
  async findOne(@Param('id') id: string, @Param('slug') slug: string): Promise<Product> {
    return await this.productsService.findOne(id, slug);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UpdateProductDoc()
  async update(@Param('id') id: string, @Param('slug') slug: string, @Body() updateProductDto: UpdateProductDto): Promise<Product> {
    return await this.productsService.update(id, updateProductDto, slug);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @DeleteProductDoc()
  async remove(@Param('id') id: string, @Param('slug') slug: string): Promise<void> {
    return await this.productsService.remove(id, slug);
  }

  @Patch('sequence')
  @UseGuards(AuthGuard)
  @UpdateProductSequencesDoc()
  async updateSequences(@Param('slug') slug: string, @Body() products: { id: string; sequenceNumber: number }[]): Promise<void> {
    return await this.productsService.updateSequences(products, slug);
  }
}
