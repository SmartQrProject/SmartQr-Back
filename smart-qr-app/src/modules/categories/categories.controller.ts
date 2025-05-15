import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../../shared/entities/category.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';


@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(AuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post(":slug")
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ 
    status: 201, 
    description: 'The category has been successfully created.',
    type: Category,
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Bebidas',
          created_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 1,
          exist: true,
          products: [],
          restaurant: {
            id: '987fcdeb-a123-12d3-a456-426614174000',
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
    type: CreateCategoryDto,
    examples: {
      category: {
        value: {
          name: "Bebidas",
        },
        description: "Example of creating a new category"
      }
    }
  })
  async create(
    @Query('slug') slug: string,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    console.log(slug, createCategoryDto);
    return await this.categoriesService.create(createCategoryDto, slug);
  }

  @Get('restaurant/:slug')
  @ApiOperation({ 
    summary: 'Get all categories for the restaurant',
    description: 'Retrieves all categories for a specific restaurant using its slug'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all categories for the restaurant.',
    content: {
      'application/json': {
        example: {
          categories: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Bebidas',
              created_at: '2024-03-20T15:30:00.000Z',
              sequenceNumber: 1,
              exist: true,
              products: [
                {
                  id: 'abc12345-e89b-12d3-a456-426614174000',
                  name: 'Coca Cola',
                  price: 2.5
                }
              ]
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
  ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
    return await this.categoriesService.findAll(slug, page, limit);
  }

  @Get('restaurant/:slug/:id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'The found category.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Bebidas',
          created_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 1,
          exist: true,
          products: [
            {
              id: 'abc12345-e89b-12d3-a456-426614174000',
              name: 'Coca Cola',
              price: 2.5
            }
          ],
          restaurant: {
            id: '987fcdeb-a123-12d3-a456-426614174000',
            name: 'Mi Restaurante Italiano'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  async findOne(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<Category> {
    return await this.categoriesService.findOne(id, slug);
  }

  @Patch('restaurant/:slug/:id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ 
    status: 200, 
    description: 'The category has been successfully updated.',
    content: {
      'application/json': {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Bebidas Calientes',
          created_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 2,
          exist: true,
          products: [],
          restaurant: {
            id: '987fcdeb-a123-12d3-a456-426614174000',
            name: 'Mi Restaurante Italiano'
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({
    type: UpdateCategoryDto,
    examples: {
      category: {
        value: {
          name: "Bebidas Calientes",
          sequenceNumber: 2
        },
        description: "Example of updating a category"
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto, slug);
  }

  @Delete('restaurant/:slug/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ 
    status: 200, 
    description: 'The category has been successfully deleted.',
    content: {
      'application/json': {
        example: {}
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ 
    name: 'slug', 
    description: 'Restaurant slug (Example: mi-restaurante-italiano)',
    example: 'mi-restaurante-italiano',
    required: true,
    type: 'string'
  })
  @ApiParam({ 
    name: 'id', 
    description: 'Category ID',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  async remove(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<void> {
    return await this.categoriesService.remove(id, slug);
  }

  @Patch('restaurant/:slug/sequence')
  @ApiOperation({ summary: 'Update sequence numbers for multiple categories' })
  @ApiResponse({ 
    status: 200, 
    description: 'The categories have been successfully reordered.',
    content: {
      'application/json': {
        example: {}
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'One or more categories not found.' })
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
      categories: {
        value: [
          { id: '123e4567-e89b-12d3-a456-426614174000', sequenceNumber: 1 },
          { id: '987fcdeb-a123-12d3-a456-426614174000', sequenceNumber: 2 }
        ],
        description: "Example of reordering categories"
      }
    }
  })
  async updateSequences(
    @Param('slug') slug: string,
    @Body() categories: { id: string, sequenceNumber: number }[]
  ): Promise<void> {
    return await this.categoriesService.updateSequences(categories, slug);
  }
}
