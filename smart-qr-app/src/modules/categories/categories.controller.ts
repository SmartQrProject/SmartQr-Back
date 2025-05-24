import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from '../../shared/entities/category.entity';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateCategoryDoc, DeleteCategoryDoc, GetAllCategoriesDoc, GetCategoryByIdDoc, UpdateCategoryDoc, UpdateCategorySequenceDoc } from './swagger/categories.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/decorators/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';

@ApiTags('Categories')
@Controller(':slug/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @CreateCategoryDoc()
  async create(@Param('slug') slug: string, @Body() createCategoryDto: CreateCategoryDto, @Req() req: Request): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto, slug, req);
  }

  @Get()
  @GetAllCategoriesDoc()
  async findAll(
    @Param('slug') slug: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{
    categories: Category[];
    total: number;
    page: number;
    limit: number;
  }> {
    return await this.categoriesService.findAll(slug, page, limit);
  }

  @Patch('sequence')
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UpdateCategorySequenceDoc()
  async updateSequences(@Param('slug') slug: string, @Body() categories: { id: string; sequenceNumber: number }[]): Promise<{ message: string }> {
    return await this.categoriesService.updateSequences(categories, slug);
  }

  @Get(':id')
  @GetCategoryByIdDoc()
  async findOne(@Param('id') id: string, @Param('slug') slug: string): Promise<Category> {
    return await this.categoriesService.findOne(id, slug);
  }

  @Patch(':id')
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @UpdateCategoryDoc()
  async update(@Param('id') id: string, @Param('slug') slug: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: Request): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto, slug, req);
  }

  @Delete(':id')
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @DeleteCategoryDoc()
  async remove(@Param('id') id: string, @Param('slug') slug: string, @Req() req: Request): Promise<{ message: string }> {
    return await this.categoriesService.remove(id, slug, req);
  }
}
