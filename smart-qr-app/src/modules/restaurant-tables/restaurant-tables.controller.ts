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
  ApiOkResponse,
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

  // --------------------- Reporte de todos las mesas de un restaurant
  @Get()
  @HttpCode(200)
  // @UseGuards(AuthGuard)
  // @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get paginated restaurants table list report',
    description:
      'Retrieves a paginated list of tables for a specific restaurant. Requires authentication.',
  })
  @ApiParam({
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
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.restaurantTablesService.findAll(slug, page, limit);
  }

  //------------------------------ Trabajando en este EP mayo 16
  @Post('seeder/:qty/:prefix')
  @ApiOperation({
    summary:
      'Generate a number of table based on the qty of tables needed and a prefix to call them.',
    description:
      'Example Qty = 5, Prefix = MesaSalon then it will create automatically MesaSalon01, MesaSalon02....',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'qty',
    description: 'Numbers of tables to be created',
    example: 10,
    required: true,
  })
  @ApiParam({
    name: 'prefix',
    description: 'Identifier of the tables',
    example: 'T',
    required: true,
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
  @ApiResponse({
    status: 200,
    description: 'List of tables',
    content: {
      'application/json': {
        schema: {
          example: {
            code: 'TestTable-03',
            restaurant: {
              id: 'e8876bd5-ae4f-4079-834d-7a93f29a648f',
              name: 'mati',
              slug: 'mati',
              owner_email: 'mati@gmail.com',
              is_active: true,
              created_at: '2025-05-16T17:29:53.453Z',
              categories: [],
              subscription: null,
              exist: true,
            },
            exist: true,
            is_active: true,
          },
        },
      },
    },
  })
  seeder(
    @Param('slug') slug: string,
    @Param('qty') qty: string,
    @Param('prefix') prefix: string,
  ) {
    return this.restaurantTablesService.seeder(slug, qty, prefix);
  }

  //-------------GET BY ID ----------------- Trabajando en este EP mayo 16
  @ApiOperation({
    summary: 'Retrieve a table definition by its ID.',
    description:
      'Retrieve a table definition by its ID for a defined Restaurant.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'mati',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'An UUID string ',
    example: '79eeeba5-0066-456c-aefe-64407a5bccd5',
    required: true,
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
  @ApiResponse({
    status: 200,
    description: 'Tabled found and returned',
    content: {
      'application/json': {
        schema: {
          example: {
            code: 'TestTable-03',
            restaurant: {
              id: 'e8876bd5-ae4f-4079-834d-7a93f29a648f',
              name: 'mati',
              slug: 'mati',
              owner_email: 'mati@gmail.com',
              is_active: true,
              created_at: '2025-05-16T17:29:53.453Z',
              categories: [],
              subscription: null,
              exist: true,
            },
            exist: true,
            is_active: true,
          },
        },
      },
    },
  })
  @Get(':id')
  findOneById(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.restaurantTablesService.findOneById(slug, id);
  }

  //===========DELETE BY ID======================================================
  @Delete(':id')
  @ApiOperation({
    summary: 'Retrieve a table definition by its ID.',
    description:
      'Retrieve a table definition by its ID for a defined Restaurant.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'mati',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'An UUID string ',
    example: '79eeeba5-0066-456c-aefe-64407a5bccd5',
    required: true,
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
  @ApiOkResponse({
    type: RestaurantTable,
    description: 'Table de-activated. Successfully Blocked',
  })
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
  deleteById(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RestaurantTable> {
    return this.restaurantTablesService.deleteById(slug, id);
  }

  //---------------Patch by ID----------------------------------
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
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRestaurantTable: UpdateRestaurantTableDto,
  ) {
    return this.restaurantTablesService.update(slug, id, updateRestaurantTable);
  }

  //---------------------------------
}
