import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';

//@ApiBearerAuth()
@Controller(':slug/restaurant-tables')
export class RestaurantTablesController {
  constructor(
    private readonly restaurantTablesService: RestaurantTablesService,
  ) {}

  @Post()
  @ApiParam({
    name: 'slug',
    description: 'Unique identifier of the restaurant',
    example: 'test-cafe',
    required: true,
  })
  create(
    @Param('slug') slug: string,
    @Body() createRestaurantTableDto: CreateRestaurantTableDto,
  ) {
    return this.restaurantTablesService.create(createRestaurantTableDto);
  }

  @Get()
  @ApiParam({
    name: 'slug',
    description: 'Unique identifier of the restaurant',
    example: 'test-cafe',
    required: true,
  })
  findAll(@Param('slug') slug: string) {
    return this.restaurantTablesService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique identifier of the restaurant',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Table ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  findOne(@Param('slug') slug: string, @Param('id') id: string) {
    return this.restaurantTablesService.findOne(+id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique identifier of the restaurant',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Table ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  update(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Body() updateRestaurantTableDto: UpdateRestaurantTableDto,
  ) {
    return this.restaurantTablesService.update(+id, updateRestaurantTableDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique identifier of the restaurant',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Table ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  remove(@Param('slug') slug: string, @Param('id') id: string) {
    return this.restaurantTablesService.remove(+id);
  }
}
