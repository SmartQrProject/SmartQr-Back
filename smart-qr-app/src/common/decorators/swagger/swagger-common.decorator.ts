import { applyDecorators } from '@nestjs/common';
import { ApiQuery, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

export function ApiSlugParam() {
  return applyDecorators(
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
  );
}

export function ApiPaginationQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      description: 'Page number',
      example: 1,
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Items per page',
      example: 5,
      required: false,
      type: Number,
    }),
  );
}

export function ApiAuth() {
  return applyDecorators(ApiBearerAuth());
}
