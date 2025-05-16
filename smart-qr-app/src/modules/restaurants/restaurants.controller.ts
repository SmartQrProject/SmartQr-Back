import { Controller, Post, Body, Get, Query, HttpCode } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags, ApiQuery } from '@nestjs/swagger';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ApiOperation({ 
    summary: 'Create a new Restaurant',
    description: 'Creates a new restaurant and its owner user. The slug must be unique and will be used as identifier in URLs.'
  })
  @ApiBody({ 
    type: CreateRestaurantsDto,
    description: 'Restaurant and owner data',
    examples: {
      testCafe: {
        value: {
          name: "Test Cafe",
          slug: "test-cafe",
          owner_email: "smartqr2@gmail.com",
          owner_pass: "!Example123"
        },
        summary: "Example of restaurant creation"
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Restaurant successfully created',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Test Cafe",
        slug: "test-cafe",
        owner_email: "smartqr2@gmail.com",
        created_at: "2024-03-20T12:34:56.789Z",
        updated_at: "2024-03-20T12:34:56.789Z",
        exist: true,
        is_active: true
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid data or slug already exists' })
  @HttpCode(200)
  @Post('create')
  async createRestaurants(@Body() dto: CreateRestaurantsDto) {
    return this.restaurantsService.createRestaurants(dto);
  }

  @ApiOperation({ 
    summary: 'Get restaurant information',
    description: 'Retrieves restaurant data and its categories/products using its unique slug.'
  })
  @ApiQuery({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Restaurant found successfully',
    schema: {
      example: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        name: "Test Cafe",
        slug: "test-cafe",
        owner_email: "smartqr2@gmail.com",
        created_at: "2024-03-20T12:34:56.789Z",
        updated_at: "2024-03-20T12:34:56.789Z",
        exist: true,
        is_active: true,
        categories: [
          {
            id: "7d1e3cd8-2a0d-4a40-8b2e-4e1c9578c8f3",
            name: "Beverages",
            products: []
          }
        ]
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found' })
  @HttpCode(200)
  @Get()
  async getRestaurants(@Query('slug') slug: string) {
    return this.restaurantsService.getRestaurants(slug);
  }
}
