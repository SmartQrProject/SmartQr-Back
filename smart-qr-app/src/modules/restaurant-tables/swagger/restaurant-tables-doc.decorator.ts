import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRestaurantTableDto } from '../dto/update-restaurant-table.dto';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';

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

const BaseDecorator = [ApiBearerAuth(), SlugParam];

const ApiPageQuery = ApiQuery({ name: 'page', example: 1, required: false, type: Number });
const ApiLimitQuery = ApiQuery({ name: 'limit', example: 5, required: false, type: Number });

const ApiUnauthorized = ApiResponse({ status: 401, description: 'Unauthorized' });
const ApiNotFound = ApiResponse({ status: 404, description: 'Restaurant not found' });

export function FindAllTablesDoc() {
  return applyDecorators(
    ...BaseDecorator,
    ApiOperation({
      summary: 'Get paginated restaurants table list report',
      description: 'Retrieves a paginated list of tables for a specific restaurant.',
    }),
    ApiPageQuery,
    ApiLimitQuery,
    ApiResponse({ status: 200, description: 'Tables listed successfully' }),
    ApiUnauthorized,
    ApiNotFound,
  );
}

export function SeederTablesDoc() {
  return applyDecorators(
    ...BaseDecorator,
    ApiParam({ name: 'qty', description: 'Numbers of tables to be created', example: 10 }),
    ApiParam({ name: 'prefix', description: 'Identifier of the tables', example: 'T' }),
    ApiOperation({
      summary: 'Generate a number of tables based on the qty of tables needed and a prefix to call them.',
      description: 'Example Qty = 5, Prefix = MesaSalon then it will create automatically MesaSalon01, MesaSalon02....',
    }),
    ApiResponse({ status: 200, description: 'List of tables' }),
    ApiNotFound,
  );
}

export function FindTableByIdDoc() {
  return applyDecorators(
    ...BaseDecorator,
    IdParam,
    ApiOperation({
      summary: 'Retrieve a table definition by its ID.',
      description: 'Retrieve a table definition by its ID for a defined Restaurant.',
    }),
    ApiResponse({ status: 200, description: 'Table found and returned' }),
    ApiNotFound,
  );
}

export function DeleteTableDoc() {
  return applyDecorators(
    ...BaseDecorator,
    IdParam,
    ApiOperation({
      summary: 'Delete a table by ID',
      description: 'Deactivates a table for a defined Restaurant.',
    }),
    ApiOkResponse({ type: RestaurantTable, description: 'Table deactivated successfully' }),
    ApiNotFound,
  );
}

export function UpdateTableDoc() {
  return applyDecorators(
    ...BaseDecorator,
    IdParam,
    ApiOperation({ summary: 'Update a restaurant table by ID' }),
    ApiBody({ type: UpdateRestaurantTableDto }),
    ApiResponse({ status: 200, description: 'Table updated successfully' }),
    ApiResponse({ status: 404, description: 'Restaurant or table not found' }),
  );
}
