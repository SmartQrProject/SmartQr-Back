import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';

//@ApiBearerAuth()
@Controller('restaurant-tables')
export class RestaurantTablesController {
  constructor(
    private readonly restaurantTablesService: RestaurantTablesService,
  ) {}

  @Post('seeder')
  create(@Body() restaurantTableSeed: CreateRestaurantTableDto) {
    return this.restaurantTablesService.seeder();
  }

  @Get()
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get paginated restaurants table list report',
    description:
      'Retrieves a paginated list of tables for a specific restaurant. Requires authentication.',
  })
  @ApiQuery({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Items per page',
    example: 5,
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Tables listed successfully',
    schema: {
      example: {
        tables: [
          {
            id: '550e8400-e29b-41d4-a716-446655440000',
            code: 'T33',
            exists: true,
            is_active: true,
            restaurant: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'Test Cafe',
              slug: 'test-cafe',
            },
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized user',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
    schema: {
      example: {
        message: 'Restaurant with slug test-cafe not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  findAll(
    @Query('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.restaurantTablesService.findAll(slug, page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantTablesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRestaurantTableDto: UpdateRestaurantTableDto,
  ) {
    return this.restaurantTablesService.update(+id, updateRestaurantTableDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restaurantTablesService.remove(+id);
  }
}
