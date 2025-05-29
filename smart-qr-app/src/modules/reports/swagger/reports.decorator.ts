import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const ApiSlugParam = ApiParam({
  name: 'slug',
  required: true,
  description: 'Restaurant slug (unique identifier)',
  example: 'test-cafe',
});

const ApiDateFromQuery = ApiQuery({
  name: 'from',
  required: true,
  type: String,
  example: '2025-05-01',
  description: 'Start date (inclusive) in YYYY-MM-DD format',
});

const ApiDateToQuery = ApiQuery({
  name: 'to',
  required: true,
  type: String,
  example: '2025-05-20',
  description: 'End date (inclusive) in YYYY-MM-DD format',
});

const ApiUnauthorizedResponse = ApiResponse({
  status: 401,
  description: 'Unauthorized access',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
});

const ApiRestaurantNotFoundResponse = ApiResponse({
  status: 404,
  description: 'Restaurant not found',
  schema: {
    example: {
      statusCode: 404,
      message: 'Restaurant with slug test-cafe not found',
      error: 'Not Found',
    },
  },
});

const BaseDecorators = [ApiBearerAuth(), ApiTags('Reports')];

export function GetSalesReportDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get total sales within a date range',
      description: 'Returns the total sales amount for a given restaurant and date range.',
    }),
    ApiSlugParam,
    ApiDateFromQuery,
    ApiDateToQuery,
    ApiResponse({
      status: 200,
      description: 'Sales total calculated successfully',
      schema: {
        example: { total: 1784.5 },
      },
    }),
    ApiUnauthorizedResponse,
    ApiRestaurantNotFoundResponse,
  );
}

export function GetTopProductsDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get top selling products',
      description: 'Returns the top 10 most or least sold products in a restaurant within a given date range.',
    }),
    ApiSlugParam,
    ApiDateFromQuery,
    ApiDateToQuery,
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
          { name: 'Café Latte', quantity: 120 },
          { name: 'Té Verde', quantity: 85 },
        ],
      },
    }),
    ApiUnauthorizedResponse,
    ApiRestaurantNotFoundResponse,
  );
}

export function GetSalesByCategoryDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Sales by category',
      description: 'Returns sales grouped by category within a date range.',
    }),
    ApiSlugParam,
    ApiDateFromQuery,
    ApiDateToQuery,
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
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function GetSalesFrequencyDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get sales count grouped by time unit',
      description: 'Returns the frequency of sales by hour, day of the week, day of the month, or month of the year.',
    }),
    ApiSlugParam,
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
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function GetCustomersReportDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Customer report with metrics and sorting',
      description: 'Returns a paginated list of customers including their email, orders, total spent, average per order, and relevant dates',
    }),
    ApiSlugParam,
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
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get count and percentage of new vs returning customers',
      description: 'Returns metrics comparing new and returning customers within a date range.',
    }),
    ApiSlugParam,
    ApiDateFromQuery,
    ApiDateToQuery,
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

export function GetSubscriptionStatsDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get subscription distribution and conversion stats',
      description: 'Returns the number of active subscriptions by type (monthly, free_trial) and how many converted from a trial to paid.',
    }),
    ApiResponse({
      status: 200,
      description: 'Subscription statistics fetched successfully',
      schema: {
        example: {
          monthly: 120,
          free_trial: 40,
          convertedFromTrial: 30,
        },
      },
    }),
    ApiUnauthorizedResponse,
  );
}

export function GetMonthlyRestaurantsStatsDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Monthly new and canceled restaurants',
      description: 'Returns how many restaurants were created and canceled per month.',
    }),
    ApiResponse({
      status: 200,
      description: 'Monthly statistics',
      schema: {
        example: [
          { month: '2025-01', newRestaurants: 12, canceledRestaurants: 3 },
          { month: '2025-02', newRestaurants: 8, canceledRestaurants: 1 },
        ],
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function GetRestaurantCustomerReachDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get unique customer count per restaurant',
      description: 'Returns how many distinct customers have placed orders in each restaurant.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of restaurants with customer reach',
      schema: {
        example: [
          { restaurantId: 'abc-123', restaurantName: 'Pasta Paradise', customers: 120 },
          { restaurantId: 'xyz-456', restaurantName: 'Sushi Street', customers: 85 },
        ],
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function GetRestaurantOwnerContactsDoc() {
  return applyDecorators(
    ...BaseDecorators,
    ApiOperation({
      summary: 'Get restaurant owners contact info',
      description: 'Returns the name, email, phone and address of restaurant owners.',
    }),
    ApiResponse({
      status: 200,
      description: 'List of owner contacts',
      schema: {
        example: [
          {
            restaurantName: 'Burger Bay',
            ownerName: 'Alex Johnson',
            ownerEmail: 'alex@example.com',
            address: '123 Main St, Sydney',
            phone: '+61 412 345 678',
          },
          {
            restaurantName: 'Taco Town',
            ownerName: 'Lucia Perez',
            ownerEmail: 'lucia@example.com',
            address: null,
            phone: null,
          },
        ],
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
