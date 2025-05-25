import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, DefaultValuePipe, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';
import { FindAllTablesDoc, SeederTablesDoc, FindTableByIdDoc, DeleteTableDoc, UpdateTableDoc } from './swagger/restaurant-tables-doc.decorator';

//@ApiBearerAuth()
@Controller(':slug/restaurant-tables')
export class RestaurantTablesController {
  constructor(private readonly restaurantTablesService: RestaurantTablesService) {}

  // --------------------- Reporte de todos las mesas de un restaurant
  @Get()
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @FindAllTablesDoc()
  findAll(@Param('slug') slug: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number) {
    return this.restaurantTablesService.findAll(slug, page, limit);
  }

  //------------------------------ Trabajando en este EP mayo 16
  @Post('seeder/:qty/:prefix')
  @SeederTablesDoc()
  seeder(@Param('slug') slug: string, @Param('qty') qty: string, @Param('prefix') prefix: string) {
    return this.restaurantTablesService.seeder(slug, qty, prefix);
  }

  //-------------GET BY ID ----------------- Trabajando en este EP mayo 16
  @Get(':id')
  @FindTableByIdDoc()
  findOneById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.restaurantTablesService.findOneById(slug, id);
  }

  //===========DELETE BY ID======================================================
  @Delete(':id')
  @DeleteTableDoc()
  deleteById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string): Promise<RestaurantTable> {
    return this.restaurantTablesService.deleteById(slug, id);
  }

  //---------------Patch by ID----------------------------------
  @Patch(':id')
  @UpdateTableDoc()
  update(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateRestaurantTable: UpdateRestaurantTableDto) {
    return this.restaurantTablesService.update(slug, id, updateRestaurantTable);
  }

  //---------------------------------
}
