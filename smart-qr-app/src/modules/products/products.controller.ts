import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from '../../shared/entities/product.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post("restaurant/:slug")
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ 
    status: 201, 
    description: 'The product has been successfully created.',
    type: Product,
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Coca Cola',
          price: 2.5,
          description: 'Bebida gaseosa',
          created_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 1,
          exist: true,
          category: {
            id: '987fcdeb-a123-12d3-a456-426614174000',
            name: 'Bebidas'
          },
          restaurant: {
            id: '456abcde-f123-12d3-a456-426614174000',
            name: 'Mi Restaurante Italiano'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiBody({
    type: CreateProductDto,
    examples: {
      product: {
        value: {
          name: "Coca Cola",
          price: 2.5,
          description: "Bebida gaseosa",
          categoryId: "987fcdeb-a123-12d3-a456-426614174000"
        },
        description: "Example of creating a new product"
      }
    }
  })
  async create(
    @Param('slug') slug: string,
    @Body() createProductDto: CreateProductDto
  ): Promise<Product> {
    return await this.productsService.create(createProductDto, slug);
  }

  @Get('restaurant/:slug')
  @ApiOperation({ 
    summary: 'Get all products for the restaurant',
    description: 'Retrieves all products for a specific restaurant using its slug'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all products for the restaurant.',
    content: {
      'application/json': {
        example: {
          products: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Coca Cola',
              price: 2.5,
              description: 'Bebida gaseosa',
              created_at: '2024-03-20T15:30:00.000Z',
              sequenceNumber: 1,
              exist: true,
              category: {
                id: '987fcdeb-a123-12d3-a456-426614174000',
                name: 'Bebidas'
              }
            }
          ],
          total: 1,
          page: 1,
          limit: 10
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiQuery({ 
    name: 'page', 
    required: false, 
    type: Number, 
    description: 'Page number (default: 1)',
    example: 1 
  })
  @ApiQuery({ 
    name: 'limit', 
    required: false, 
    type: Number, 
    description: 'Items per page (default: 10)',
    example: 10 
  })
  async findAll(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    return await this.productsService.findAll(slug, page, limit);
  }

  @Get('restaurant/:slug/:id')
  @ApiOperation({ summary: 'Get a product by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'The found product.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Coca Cola',
          price: 2.5,
          description: 'Bebida gaseosa',
          created_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 1,
          exist: true,
          category: {
            id: '987fcdeb-a123-12d3-a456-426614174000',
            name: 'Bebidas'
          },
          restaurant: {
            id: '456abcde-f123-12d3-a456-426614174000',
            name: 'Mi Restaurante Italiano'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  async findOne(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<Product> {
    return await this.productsService.findOne(id, slug);
  }

  @Patch('restaurant/:slug/:id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ 
    status: 200, 
    description: 'The product has been successfully updated.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Coca Cola Light',
          price: 2.75,
          description: 'Bebida gaseosa sin azúcar',
          created_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 2,
          exist: true,
          category: {
            id: '987fcdeb-a123-12d3-a456-426614174000',
            name: 'Bebidas'
          },
          restaurant: {
            id: '456abcde-f123-12d3-a456-426614174000',
            name: 'Mi Restaurante Italiano'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateProductDto,
    examples: {
      product: {
        value: {
          name: "Coca Cola Light",
          price: 2.75,
          description: "Bebida gaseosa sin azúcar",
          sequenceNumber: 2,
          categoryId: "987fcdeb-a123-12d3-a456-426614174000"
        },
        description: "Example of updating a product"
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Param('slug') slug: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return await this.productsService.update(id, updateProductDto, slug);
  }

  @Delete('restaurant/:slug/:id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ 
    status: 200, 
    description: 'The product has been successfully deleted.',
    content: {
      'application/json': {
        example: {}
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Product ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  async remove(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<void> {
    return await this.productsService.remove(id, slug);
  }

  @Patch('restaurant/:slug/sequence')
  @ApiOperation({ summary: 'Update sequence numbers for multiple products' })
  @ApiResponse({ 
    status: 200, 
    description: 'The sequence numbers have been successfully updated.',
    content: {
      'application/json': {
        example: {}
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'One or more products not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '123e4567-e89b-12d3-a456-426614174000'
          },
          sequenceNumber: {
            type: 'number',
            example: 1
          }
        }
      }
    },
    examples: {
      products: {
        value: [
          {
            id: "123e4567-e89b-12d3-a456-426614174000",
            sequenceNumber: 1
          },
          {
            id: "456abcde-f123-12d3-a456-426614174000",
            sequenceNumber: 2
          }
        ],
        description: "Example of updating sequence numbers for multiple products"
      }
    }
  })
  async updateSequences(
    @Param('slug') slug: string,
    @Body() products: { id: string, sequenceNumber: number }[]
  ): Promise<void> {
    return await this.productsService.updateSequences(products, slug);
  }
}
