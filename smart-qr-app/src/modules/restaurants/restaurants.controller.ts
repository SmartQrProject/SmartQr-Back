import { Controller, Post, Body, Get, Query, HttpCode, UseGuards, Patch, Param, Req, Delete } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import {
  CreateRestaurantDoc,
  DeleteRestaurantBySlugDoc,
  GetAllRestaurantsDoc,
  GetRestaurantDoc,
  GetRestaurantPublicDoc,
  PatchRestaurantBySlugDoc,
} from './swagger/restaurants-doc.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/decorators/role.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { PatchRestaurantsDto } from './dto/patch-restaurants.dto';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Post('create')
  @HttpCode(200)
  @CreateRestaurantDoc()
  async createRestaurants(@Body() dto: CreateRestaurantsDto) {
    return this.restaurantsService.createRestaurants(dto);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @GetRestaurantDoc()
  async getRestaurants(@Query('slug') slug: string) {
    return this.restaurantsService.getRestaurants(slug);
  }

  @Get('public')
  @HttpCode(200)
  @GetRestaurantPublicDoc()
  async getRestaurantsPublic(@Query('slug') slug: string) {
    return this.restaurantsService.getRestaurantsPublic(slug);
  }

  @Patch(':slug')
  @HttpCode(200)
  @PatchRestaurantBySlugDoc()
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async pachtRestaurantBySlug(@Param('slug') slug: string, @Body() restaurantData: Partial<PatchRestaurantsDto>, @Req() req: Request): Promise<string> {
    return this.restaurantsService.patchRestaurantBySlug(slug, restaurantData, req);
  }

  @Get('all')
  @HttpCode(200)
  @Roles(Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @GetAllRestaurantsDoc()
  async getAllRestaurants() {
    return this.restaurantsService.getAllRestaurants();
  }

  @Delete(':slug')
  @HttpCode(200)
  @DeleteRestaurantBySlugDoc()
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteRestaurantBySlug(@Param('slug') slug: string, @Req() req: Request): Promise<string> {
    return this.restaurantsService.deleteRestaurantBySlug(slug, req);
  }
}
