import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, Query, DefaultValuePipe, ParseIntPipe, ParseUUIDPipe, UseGuards, Req } from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { FindAllTablesDoc, SeederTablesDoc, FindTableByIdDoc, DeleteTableDoc, UpdateTableDoc } from './swagger/restaurant-tables-doc.decorator';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/decorators/role.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller(':slug/restaurant-tables')
export class RestaurantTablesController {
  constructor(private readonly restaurantTablesService: RestaurantTablesService) {}

  // --------------------- Reporte de todos las mesas de un restaurant
  @Get()
  @HttpCode(200)
  @Roles(Role.Owner, Role.SuperAdmin, Role.Staff)
  @UseGuards(AuthGuard, RolesGuard)
  @FindAllTablesDoc()
  findAll(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Req() req: Request,
  ) {
    return this.restaurantTablesService.findAll(slug, page, limit, req);
  }

  //------------------------------ Trabajando en este EP mayo 16
  @Post('seeder/:qty/:prefix')
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @SeederTablesDoc()
  seeder(@Param('slug') slug: string, @Param('qty') qty: string, @Param('prefix') prefix: string, @Req() req: Request) {
    return this.restaurantTablesService.seeder(slug, qty, prefix, req);
  }

  //-------------GET BY ID ----------------- Trabajando en este EP mayo 16
  @Get(':id')
  @Roles(Role.Owner, Role.SuperAdmin, Role.Staff)
  @UseGuards(AuthGuard, RolesGuard)
  @FindTableByIdDoc()
  findOneById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.restaurantTablesService.findOneById(slug, id, req);
  }

  //===========DELETE BY ID======================================================
  @Delete(':id')
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @DeleteTableDoc()
  deleteById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Req() req: Request): Promise<RestaurantTable> {
    return this.restaurantTablesService.deleteById(slug, id, req);
  }

  //---------------Patch by ID----------------------------------
  @Patch(':id')
  @Roles(Role.Owner, Role.SuperAdmin, Role.Staff)
  @UseGuards(AuthGuard, RolesGuard)
  @UpdateTableDoc()
  update(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateRestaurantTable: UpdateRestaurantTableDto, @Req() req: Request) {
    return this.restaurantTablesService.update(slug, id, updateRestaurantTable, req);
  }

  //---------------------------------
}
