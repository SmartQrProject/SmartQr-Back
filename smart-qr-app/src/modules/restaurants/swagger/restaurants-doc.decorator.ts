import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { CreateRestaurantsDto } from '../dto/create-restaurants.dto';

export function CreateRestaurantDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new Restaurant',
      description: 'Creates a new restaurant and its owner user. The slug must be unique and will be used as identifier in URLs.',
    }),
    ApiBody({
      type: CreateRestaurantsDto,
      description: 'Restaurant and owner data',
      examples: {
        testCafe: {
          summary: 'Example of restaurant creation',
          value: {
            name: 'Test Cafe',
            slug: 'test-cafe',
            owner_email: 'smartqr2@gmail.com',
            owner_pass: '!Example123',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant successfully created',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Cafe',
          slug: 'test-cafe',
          owner_email: 'smartqr2@gmail.com',
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:34:56.789Z',
          exist: true,
          is_active: true,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid data or slug already exists',
    }),
  );
}

export function GetRestaurantDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get restaurant information',
      description: 'Retrieves restaurant data and its categories/products using its unique slug.',
    }),
    ApiQuery({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant found successfully',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Cafe',
          slug: 'test-cafe',
          owner_email: 'smartqr2@gmail.com',
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:34:56.789Z',
          exist: true,
          is_active: true,
          categories: [
            {
              id: '7d1e3cd8-2a0d-4a40-8b2e-4e1c9578c8f3',
              name: 'Beverages',
              products: [],
            },
          ],
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function GetRestaurantPublicDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get restaurant public information',
      description: 'Retrieves restaurant public data and its categories/products using its unique slug.',
    }),
    ApiQuery({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Public restaurant info retrieved successfully',
      schema: {
        example: {
          name: 'Test Cafe',
          slug: 'test-cafe',
          is_active: true,
          banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
          categories: [
            {
              name: 'Beverages',
              sequenceNumber: 0,
              products: [
                {
                  sequenceNumber: 2,
                  name: 'Fanta Zero',
                  description: 'Sugar-free Fanta 355ml',
                  price: '2.75',
                  image_url: 'https://example.com/images/fanta-zero.jpg',
                  is_available: true,
                  details: ['sin gluten', 'vegano'],
                },
              ],
            },
          ],
        },
      },
    }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

//PatchRestaurantBySlugDoc
export function PatchRestaurantBySlugDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Modify Name and Onwers email for a Restaurant',
      description: 'Updates Name and Owner_Email. You should provide SLUG to access the data',
    }),
    ApiBody({
      type: CreateRestaurantsDto,
      description: 'Restaurant and owner data',
      examples: {
        testCafe: {
          summary: 'Example of restaurant profile update',
          value: {
            name: 'Test Cafe',
            banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant successfully created',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Test Cafe',
          slug: 'test-cafe',
          owner_email: 'smartqr2@gmail.com',
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:34:56.789Z',
          exist: true,
          is_active: true,
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid data or slug already exists',
    }),
  );
}

export const GetAllRestaurantsDoc = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Get all restaurants',
      description: 'Returns all registered restaurants with basic info',
    }),
    ApiOkResponse({
      description: 'Array of restaurants',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid', example: '9f07cf57-82e3-4050-8beb-ed7f011b1794' },
            name: { type: 'string', example: 'Eli Cafe' },
            slug: { type: 'string', example: 'eli-cafe' },
            owner_email: { type: 'string', format: 'email', example: 'elicafe@gmail.com' },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time', example: '2025-05-16T06:16:47.629Z' },
            subscription: { type: 'string', nullable: true, example: null },
            exist: { type: 'boolean', example: true },
            banner: {
              type: 'string',
              format: 'uri',
              example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1748134217/banners/zj631kav9gxmqqpqxz3s.jpg',
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
  );
