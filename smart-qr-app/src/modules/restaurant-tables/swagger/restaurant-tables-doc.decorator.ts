import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { UpdateRestaurantTableDto } from '../dto/update-restaurant-table.dto';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';

// Decorador reutilizable de slug
const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'test-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Table ID',
  example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
});

export function FindAllTablesDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({
      summary: 'Get paginated restaurants table list report',
      description: 'Retrieves a paginated list of tables for a specific restaurant.',
    }),
    ApiQuery({ name: 'page', example: 1, required: false, type: Number }),
    ApiQuery({ name: 'limit', example: 5, required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: 'Tables listed successfully',
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant not found',
    }),
  );
}

export function SeederTablesDoc() {
  return applyDecorators(
    SlugParam,
    ApiParam({
      name: 'qty',
      description: 'Numbers of tables to be created',
      example: 10,
    }),
    ApiParam({
      name: 'prefix',
      description: 'Identifier of the tables',
      example: 'T',
    }),
    ApiOperation({
      summary: 'Generate a number of tables based on the qty of tables needed and a prefix to call them.',
      description: 'Example Qty = 5, Prefix = MesaSalon then it will create automatically MesaSalon01, MesaSalon02....',
    }),
    ApiResponse({ status: 200, description: 'List of tables' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function FindTableByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Retrieve a table definition by its ID.',
      description: 'Retrieve a table definition by its ID for a defined Restaurant.',
    }),
    ApiResponse({ status: 200, description: 'Table found and returned' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function DeleteTableDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Delete a table by ID',
      description: 'Deactivates a table for a defined Restaurant.',
    }),
    ApiOkResponse({
      type: RestaurantTable,
      description: 'Table deactivated successfully',
    }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function UpdateTableDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Update a restaurant table by ID' }),
    ApiBody({ type: UpdateRestaurantTableDto }),
    ApiResponse({ status: 200, description: 'Table updated successfully' }),
    ApiResponse({ status: 404, description: 'Restaurant or table not found' }),
  );
}
