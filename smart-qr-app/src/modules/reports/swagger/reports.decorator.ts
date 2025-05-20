import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

export function GetSalesReportDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Reports'),
    ApiOperation({
      summary: 'Get total sales within a date range',
      description: 'Returns the total sales amount for a given restaurant and date range.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Restaurant slug (unique identifier)',
      example: 'test-cafe',
    }),
    ApiQuery({
      name: 'from',
      required: true,
      type: String,
      example: '2025-05-01',
      description: 'Start date (inclusive) in YYYY-MM-DD format',
    }),
    ApiQuery({
      name: 'to',
      required: true,
      type: String,
      example: '2025-05-20',
      description: 'End date (inclusive) in YYYY-MM-DD format',
    }),
    ApiResponse({
      status: 200,
      description: 'Sales total calculated successfully',
      schema: {
        example: {
          total: 1784.5,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant not found',
      schema: {
        example: {
          message: 'Restaurant with slug test-cafe not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

export function GetTopProductsDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Reports'),
    ApiOperation({
      summary: 'Get top selling products',
      description: 'Returns the top 10 most or least sold products in a restaurant within a given date range.',
    }),
    ApiParam({
      name: 'slug',
      required: true,
      description: 'Restaurant slug (unique identifier)',
      example: 'test-cafe',
    }),
    ApiQuery({
      name: 'from',
      required: true,
      type: String,
      example: '2025-05-01',
      description: 'Start date in YYYY-MM-DD format (inclusive)',
    }),
    ApiQuery({
      name: 'to',
      required: true,
      type: String,
      example: '2025-05-20',
      description: 'End date in YYYY-MM-DD format (inclusive)',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      type: String,
      enum: ['asc', 'desc'],
      example: 'desc',
      description: 'Sorting direction: "desc" for most sold, "asc" for least sold',
    }),
    ApiResponse({
      status: 200,
      description: 'Array of top sold products',
      schema: {
        example: [
          {
            name: 'Café Latte',
            quantity: 120,
          },
          {
            name: 'Té Verde',
            quantity: 85,
          },
        ],
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Restaurant with slug test-cafe not found',
          error: 'Not Found',
        },
      },
    }),
  );
}

export function GetSalesByCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Reports'),
    ApiOperation({
      summary: 'Ventas por categoría',
      description: 'Devuelve las ventas agrupadas por categoría dentro de un rango de fechas.',
    }),
    ApiParam({
      name: 'slug',
      required: true,
      example: 'test-cafe',
    }),
    ApiQuery({
      name: 'from',
      required: true,
      type: String,
      example: '2025-05-01',
      description: 'Fecha de inicio (YYYY-MM-DD)',
    }),
    ApiQuery({
      name: 'to',
      required: true,
      type: String,
      example: '2025-05-20',
      description: 'Fecha de fin (YYYY-MM-DD)',
    }),
    ApiQuery({
      name: 'sort',
      required: false,
      enum: ['asc', 'desc'],
      description: 'Orden por total vendido (asc = menos vendida, desc = más vendida)',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de categorías con totales y porcentajes',
      schema: {
        example: [
          {
            category: 'Bebidas',
            total: 230.5,
            percentage: 48.2,
            quantity: 84,
            average_price: 2.74,
          },
        ],
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
    }),
  );
}
