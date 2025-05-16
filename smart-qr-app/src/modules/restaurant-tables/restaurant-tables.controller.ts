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
  ParseUUIDPipe,
} from '@nestjs/common';
import { RestaurantTablesService } from './restaurant-tables.service';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

//@ApiBearerAuth()
@Controller(':slug/restaurant-tables')
export class RestaurantTablesController {
  constructor(
    private readonly restaurantTablesService: RestaurantTablesService,
  ) {}

  // ---------------------creation of tables based on a automatic seeder
  @Post('seeder/:qty/:prefix')
  @ApiParam({
    name: 'Slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'NumberOfTables',
    description:
      'Numbers of Tables will be created based on a prefix. Max: 99 Tables',
    example: '7',
    required: true,
  })
  @ApiParam({
    name: 'TablePrefix',
    description:
      'Tables name prefix: Example: Salon-Table. You will get Salon-Table-01, Salon-Table-02 , Salon-Table-03, etc',
    example: 'Table',
    required: true,
  })
  // @ApiResponse({
  //   status: 200,
  //   description:
  //     'Tables created successfully. Check EndoPoint to list all tables',
  //   schema: {
  //     example: {
  //       tables: [
  //         {
  //           id: '550e8400-e29b-41d4-a716-446655440000',
  //           code: 'T33',
  //           exists: true,
  //           is_active: true,
  //           restaurant: {
  //             id: '550e8400-e29b-41d4-a716-446655440000',
  //             name: 'Test Cafe',
  //             slug: 'test-cafe',
  //           },
  //         },
  //       ],
  //     },
  //   },
  // })
  seeder(
    @Param('Slug') slug: string,
    @Param('NumberOfTables') qty: string,
    @Param('TablePrefix') prefix: string,
  ) {
    return this.restaurantTablesService.seeder(slug, qty, prefix);
  }

  // --------------------- Reporte de todos las mesas de un restaurant
  @Get()
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get paginated restaurants table list report',
    description:
      'Retrieves a paginated list of tables for a specific restaurant. Requires authentication.',
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

  //------------------------------ Trabajando en este EP mayo 16
  @Get(':id')
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Returns the one Table info',
    description:
      'Retrieves a table info related depending on the table ID for a specific restaurant. Requires authentication.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Unique restaurant Table identifier. A UUID field type',
    example: '3f83e775-ca30-4fe0-ba46-d1a9516d5a1d',
    required: true,
    type: UUID,
  })
  @ApiResponse({
    status: 200,
    description: 'Table details listed successfully',
    schema: {
      example: {
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
  findOne(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RestaurantTable> {
    return this.restaurantTablesService.findOne(slug, id);
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
