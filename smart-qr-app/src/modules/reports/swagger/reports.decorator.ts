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
