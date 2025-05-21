import { Controller, Post, Body, Get, Query, HttpCode, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CreateRestaurantDoc, GetRestaurantDoc, GetRestaurantPublicDoc } from './swagger/restaurants-doc.decorator';
import { AuthGuard } from 'src/common/guards/auth.guard';

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
}
