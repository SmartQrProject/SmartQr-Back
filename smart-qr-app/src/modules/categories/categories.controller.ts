import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuth0Guard } from '../../common/guards/jwt-auth0.guard';
import { Category } from '../../shared/entities/category.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('categories')
@ApiBearerAuth()
@Controller('categories')
@UseGuards(JwtAuth0Guard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ 
    status: 201, 
    description: 'The category has been successfully created.',
    type: Category 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @Request() req
  ): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, req.user.restaurantId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories for the restaurant' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all categories for the restaurant.',
    type: [Category]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  async findAll(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
    return await this.categoriesService.findAll(req.user.restaurantId, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by id' })
  @ApiResponse({ 
    status: 200, 
    description: 'The found category.',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@Param('id') id: string, @Request() req): Promise<Category> {
    return await this.categoriesService.findOne(id, req.user.restaurantId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiResponse({ 
    status: 200, 
    description: 'The category has been successfully updated.',
    type: Category
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @Request() req
  ): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto, req.user.restaurantId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiResponse({ status: 200, description: 'The category has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(@Param('id') id: string, @Request() req): Promise<void> {
    return await this.categoriesService.remove(id, req.user.restaurantId);
  }
}
