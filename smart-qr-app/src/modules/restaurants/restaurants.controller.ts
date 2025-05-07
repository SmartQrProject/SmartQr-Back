import { Controller, Post, Body, Get, Query, HttpCode } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Db de restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ApiOperation({ summary: 'Crear una nueva Tienda' })
  @ApiBody({ type: CreateRestaurantsDto })
  @ApiResponse({ status: 200, description: 'Tienda creada con éxito' })
  @HttpCode(200)
  @Post('create')
  async createRestaurants(@Body() dto: CreateRestaurantsDto) {
    return this.restaurantsService.createRestaurants(dto);
  }

  @ApiOperation({ summary: 'Buscar una nueva Tienda' })
  @ApiResponse({ status: 200, description: 'Tienda entrada con éxito' })
  @HttpCode(200)
  @Get()
  async getRestaurants(@Query('slug') slug: string) {
    return this.restaurantsService.getRestaurants(slug);
  }
}
