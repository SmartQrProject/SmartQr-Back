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
      summary: 'Sales by category',
      description: 'Returns sales grouped by category within a date range.',
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
      description: 'Order by total sold (asc = least sold, desc = most sold)',
    }),
    ApiResponse({
      status: 200,
      description: 'List of categories with totals and percentages',
      schema: {
        example: [
          {
            category: 'Beverages',
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
      description: 'Unauthorized',
    }),
  );
}

export function GetSalesFrequencyDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Reports'),
    ApiOperation({
      summary: 'Get sales count grouped by time unit',
      description: 'Returns the frequency of sales by hour, day of the week, day of the month, or month of the year.',
    }),
    ApiParam({
      name: 'slug',
      required: true,
      example: 'test-cafe',
      description: 'Restaurant slug',
    }),
    ApiQuery({
      name: 'group',
      enum: ['hour', 'weekday', 'monthday', 'month'],
      required: true,
      description: 'Time unit to group sales by',
    }),
    ApiResponse({
      status: 200,
      description: 'Sales frequency returned successfully',
      schema: {
        example: [
          { label: '00', count: 5 },
          { label: '01', count: 2 },
          { label: '02', count: 0 },
        ],
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
}

export function GetCustomersReportDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Reports'),
    ApiOperation({
      summary: 'Customer report with metrics and sorting',
      description: 'Returns a paginated list of customers including their email, orders, total spent, average per order, and relevant dates',
    }),
    ApiParam({ name: 'slug', example: 'test-cafe', description: 'Restaurant slug' }),
    ApiQuery({ name: 'sortBy', required: false, enum: ['name', 'email', 'orders', 'totalSpent', 'averageOrder', 'createdAt', 'lastVisit', 'daysSince'] }),
    ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] }),
    ApiQuery({ name: 'page', required: false, example: '1' }),
    ApiQuery({ name: 'limit', required: false, example: '10' }),
    ApiResponse({ status: 200, description: 'List of customers with metrics' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function GetCustomerTypesDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiTags('Reports'),
    ApiOperation({
      summary: 'Get count and percentage of new vs returning customers',
      description: 'Returns metrics comparing new and returning customers within a date range.',
    }),
    ApiParam({
      name: 'slug',
      required: true,
      description: 'Restaurant slug',
      example: 'test-cafe',
    }),
    ApiQuery({
      name: 'from',
      required: true,
      type: String,
      example: '2025-05-01',
    }),
    ApiQuery({
      name: 'to',
      required: true,
      type: String,
      example: '2025-05-20',
    }),
    ApiResponse({
      status: 200,
      description: 'Customer report',
      schema: {
        example: {
          newCustomers: 8,
          returningCustomers: 15,
          newPercentage: 34.78,
          returningPercentage: 65.22,
        },
      },
    }),
  );
}
