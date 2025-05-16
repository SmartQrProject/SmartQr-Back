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
  @ApiOperation({ 
    summary: 'Create a new product',
    description: 'Creates a new product in a specific category for the restaurant menu.'
  })
  @ApiParam({ 
    name: 'slug', 
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product data',
    examples: {
      beverage: {
        value: {
          name: "Coca Cola",
          price: 2.5,
          description: "Regular Coca Cola 355ml",
          image_url: "https://example.com/images/coca-cola.jpg",
          categoryId: "c2917676-d3d2-472a-8b7c-785f455a80ab"
        },
        summary: "Create a beverage product"
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    schema: {
      example: {
        id: "abc12345-e89b-12d3-a456-426614174000",
        name: "Coca Cola",
        price: 2.5,
        description: "Regular Coca Cola 355ml",
        image_url: "https://example.com/images/coca-cola.jpg",
        created_at: "2024-03-20T15:30:00.000Z",
        updated_at: "2024-03-20T15:30:00.000Z",
        sequenceNumber: 1,
        exist: true,
        category: {
          id: "c2917676-d3d2-472a-8b7c-785f455a80ab",
          name: "Hot Beverages"
        },
        restaurant: {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Test Cafe",
          slug: "test-cafe"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        message: "Unauthorized user",
        error: "Unauthorized",
        statusCode: 401
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Restaurant or category not found',
    schema: {
      example: {
        message: "Category not found in restaurant test-cafe",
        error: "Not Found",
        statusCode: 404
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid data provided',
    schema: {
      example: {
        message: "Invalid product data",
        error: "Bad Request",
        statusCode: 400
      }
    }
  })
  async create(
    @Param('slug') slug: string,
    @Body() createProductDto: CreateProductDto
  ): Promise<Product> {
    return await this.productsService.create(createProductDto, slug);
  }

    @Get('restaurant/:slug')  @ApiOperation({     summary: 'Get all products for the restaurant',    description: 'Retrieves all products for a specific restaurant using its slug. Products are returned paginated and ordered by their sequence number.'  })  @ApiResponse({     status: 200,     description: 'List of all products for the restaurant successfully retrieved',    content: {      'application/json': {        example: {          products: [            {              id: "abc12345-e89b-12d3-a456-426614174000",              name: "Coca Cola",              price: 2.5,              description: "Regular Coca Cola 355ml",              image_url: "https://example.com/images/coca-cola.jpg",              created_at: "2024-03-20T15:30:00.000Z",              updated_at: "2024-03-20T15:30:00.000Z",              sequenceNumber: 1,              exist: true,              category: {                id: "c2917676-d3d2-472a-8b7c-785f455a80ab",                name: "Hot Beverages"              },              restaurant: {                id: "550e8400-e29b-41d4-a716-446655440000",                name: "Test Cafe",                slug: "test-cafe"              }            }          ],          total: 1,          page: 1,          limit: 10        }      }    }  })  @ApiResponse({     status: 401,     description: 'Unauthorized',    schema: {      example: {        message: "Unauthorized user",        error: "Unauthorized",        statusCode: 401      }    }  })  @ApiResponse({     status: 404,     description: 'Restaurant not found',    schema: {      example: {        message: "Restaurant test-cafe not found",        error: "Not Found",        statusCode: 404      }    }  })  @ApiParam({     name: 'slug',     description: 'Unique restaurant identifier',    example: 'test-cafe',    required: true,    type: 'string'  })  @ApiQuery({     name: 'page',     required: false,     type: Number,     description: 'Page number for pagination',    example: 1   })  @ApiQuery({     name: 'limit',     required: false,     type: Number,     description: 'Number of items per page',    example: 10   })
  async findAll(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ products: Product[]; total: number; page: number; limit: number }> {
    return await this.productsService.findAll(slug, page, limit);
  }

    @Get('restaurant/:slug/:id')  @ApiOperation({     summary: 'Get a product by ID',    description: 'Retrieves a specific product from a restaurant using the restaurant slug and product ID'  })  @ApiResponse({     status: 200,     description: 'Product found successfully',    content: {      'application/json': {        example: {          id: '97ed9278-5451-4363-8bbc-c4280bfd0f02',          name: 'Coca Cola',          price: 2.5,          description: 'Regular Coca Cola 355ml',          image_url: 'https://example.com/images/coca-cola.jpg',          created_at: '2024-03-20T15:30:00.000Z',          updated_at: '2024-03-20T15:30:00.000Z',          sequenceNumber: 1,          exist: true,          category: {            id: 'c2917676-d3d2-472a-8b7c-785f455a80ab',            name: 'Hot Beverages'          },          restaurant: {            id: '550e8400-e29b-41d4-a716-446655440000',            name: 'Test Cafe',            slug: 'test-cafe'          }        }      }    }  })  @ApiResponse({     status: 401,     description: 'Unauthorized',    schema: {      example: {        message: "Unauthorized user",        error: "Unauthorized",        statusCode: 401      }    }  })  @ApiResponse({     status: 404,     description: 'Product or restaurant not found',    schema: {      example: {        message: "Product not found in restaurant test-cafe",        error: "Not Found",        statusCode: 404      }    }  })  @ApiParam({     name: 'slug',     description: 'Unique restaurant identifier',    example: 'test-cafe',    required: true,    type: 'string'  })  @ApiParam({     name: 'id',     description: 'Unique product identifier',    example: '97ed9278-5451-4363-8bbc-c4280bfd0f02',    required: true  })
  async findOne(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<Product> {
    return await this.productsService.findOne(id, slug);
  }

    @Patch('restaurant/:slug/:id')  @ApiOperation({     summary: 'Update a product',    description: 'Updates an existing product in the restaurant menu with the provided data'  })  @ApiResponse({     status: 200,     description: 'Product updated successfully',    content: {      'application/json': {        example: {          id: '97ed9278-5451-4363-8bbc-c4280bfd0f02',          name: 'Coca Cola Zero',          price: 2.75,          description: 'Sugar-free Coca Cola 355ml',          image_url: 'https://example.com/images/coca-cola-zero.jpg',          created_at: '2024-03-20T15:30:00.000Z',          updated_at: '2024-03-20T16:45:00.000Z',          sequenceNumber: 2,          exist: true,          category: {            id: 'c2917676-d3d2-472a-8b7c-785f455a80ab',            name: 'Hot Beverages'          },          restaurant: {            id: '550e8400-e29b-41d4-a716-446655440000',            name: 'Test Cafe',            slug: 'test-cafe'          }        }      }    }  })  @ApiResponse({     status: 401,     description: 'Unauthorized',    schema: {      example: {        message: "Unauthorized user",        error: "Unauthorized",        statusCode: 401      }    }  })  @ApiResponse({     status: 404,     description: 'Product or restaurant not found',    schema: {      example: {        message: "Product not found in restaurant test-cafe",        error: "Not Found",        statusCode: 404      }    }  })  @ApiResponse({     status: 400,     description: 'Invalid data provided',    schema: {      example: {        message: "Invalid product data",        error: "Bad Request",        statusCode: 400      }    }  })  @ApiParam({     name: 'slug',     description: 'Unique restaurant identifier',    example: 'test-cafe',    required: true,    type: 'string'  })  @ApiParam({     name: 'id',     description: 'Unique product identifier',    example: '97ed9278-5451-4363-8bbc-c4280bfd0f02',    required: true  })  @ApiBody({    type: UpdateProductDto,    description: 'Updated product data',    examples: {      product: {        value: {          name: "Coca Cola Zero",          price: 2.75,          description: "Sugar-free Coca Cola 355ml",          image_url: "https://example.com/images/coca-cola-zero.jpg",          sequenceNumber: 2,          categoryId: "c2917676-d3d2-472a-8b7c-785f455a80ab"        },        description: "Example of updating a product's details"      }    }  })
  async update(
    @Param('id') id: string,
    @Param('slug') slug: string,
    @Body() updateProductDto: UpdateProductDto
  ): Promise<Product> {
    return await this.productsService.update(id, updateProductDto, slug);
  }

    @Delete('restaurant/:slug/:id')  @ApiOperation({     summary: 'Delete a product',    description: 'Removes a product from the restaurant menu. This action cannot be undone.'  })  @ApiResponse({     status: 200,     description: 'Product deleted successfully',    content: {      'application/json': {        example: {          message: "Product 'Coca Cola Zero' has been deleted from restaurant 'Test Cafe'"        }      }    }  })  @ApiResponse({     status: 401,     description: 'Unauthorized',    schema: {      example: {        message: "Unauthorized user",        error: "Unauthorized",        statusCode: 401      }    }  })  @ApiResponse({     status: 404,     description: 'Product or restaurant not found',    schema: {      example: {        message: "Product not found in restaurant test-cafe",        error: "Not Found",        statusCode: 404      }    }  })  @ApiParam({     name: 'slug',     description: 'Unique restaurant identifier',    example: 'test-cafe',    required: true,    type: 'string'  })  @ApiParam({     name: 'id',     description: 'Unique product identifier',    example: '97ed9278-5451-4363-8bbc-c4280bfd0f02',    required: true  })
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
