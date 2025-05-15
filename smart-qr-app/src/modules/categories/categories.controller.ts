import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuth0Guard } from '../../common/guards/jwt-auth0.guard';
import { Category } from '../../shared/entities/category.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuth0Guard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post(':slug')
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ 
    status: 201, 
    description: 'The category has been successfully created.',
    type: Category 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'slug', description: 'Restaurant slug' })
  async create(
    @Param('slug') slug: string,
    @Body() createCategoryDto: CreateCategoryDto
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, slug);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get all categories for the restaurant' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all categories for the restaurant.',
    type: [Category]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiParam({ name: 'slug', description: 'Restaurant slug' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  async findAll(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
    return await this.categoriesService.findAll(slug, page, limit);
  }

  @Get(':slug/:id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'The found category.',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'slug', description: 'Restaurant slug' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async findOne(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<Category> {
    return await this.categoriesService.findOne(id, slug);
  }

  @Patch(':slug/:id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ 
    status: 200, 
    description: 'The category has been successfully updated.',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'slug', description: 'Restaurant slug' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async update(
    @Param('id') id: string,
    @Param('slug') slug: string,
    @Body() updateCategoryDto: UpdateCategoryDto
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto, slug);
  }

  @Delete(':slug/:id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiParam({ name: 'slug', description: 'Restaurant slug' })
  @ApiParam({ name: 'id', description: 'Category ID' })
  async remove(
    @Param('id') id: string,
    @Param('slug') slug: string
  ): Promise<void> {
    return await this.categoriesService.remove(id, slug);
  }

  @Patch(':slug/sequence')
  @ApiOperation({ summary: 'Update sequence numbers for multiple categories' })
  @ApiResponse({ status: 200, description: 'The categories have been successfully reordered.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'One or more categories not found.' })
  @ApiParam({ name: 'slug', description: 'Restaurant slug' })
  async updateSequences(
    @Param('slug') slug: string,
    @Body() categories: { id: string, sequenceNumber: number }[]
  ): Promise<void> {
    return await this.categoriesService.updateSequences(categories, slug);
  }
}
