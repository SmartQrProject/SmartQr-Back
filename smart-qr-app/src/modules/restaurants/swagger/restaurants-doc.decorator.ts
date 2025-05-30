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
    ApiQuery({
      name: 'slug',
      required: true,
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
    }),
    ApiOperation({
      summary: 'Get public data of a restaurant by slug',
      description: 'Retrieves public data of a restaurant including address, contact, categories and products',
    }),
    ApiResponse({
      status: 200,
      description: 'Returns public restaurant information including categories and products',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Smart Qr Oficial' },
          slug: { type: 'string', example: 'test-cafe' },
          is_active: { type: 'boolean', example: true },
          banner: {
            type: 'string',
            example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
          },
          address: { type: 'string', nullable: true, example: '123 Main St, Sydney' },
          phone: { type: 'string', nullable: true, example: '+61 400 000 000' },
          description: {
            type: 'string',
            nullable: true,
            example: 'Cozy cafe with specialty coffee and artisan pastries.',
          },
          tags: {
            type: 'array',
            nullable: true,
            items: { type: 'string' },
            example: ['coffee', 'pastries', 'breakfast'],
          },
          trading_hours: {
            type: 'object',
            nullable: true,
            example: {
              mondayToFriday: { open: '08:00', close: '18:00' },
              saturday: { open: '09:00', close: '15:00' },
              sunday: { open: '09:00', close: '14:00' },
            },
          },
          ordering_times: {
            type: 'object',
            nullable: true,
            example: {
              pickup: '10-18',
              dinein: '11-17',
            },
          },
          categories: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string', example: 'Beverages' },
                sequenceNumber: { type: 'number', example: 1 },
                products: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      sequenceNumber: { type: 'number', example: 1 },
                      id: {
                        type: 'string',
                        format: 'uuid',
                        example: 'c1fa9f2c-bbd4-4f7a-bcb2-4f799ac3ea99',
                      },
                      name: { type: 'string', example: 'Espresso' },
                      description: { type: 'string', example: 'Strong and bold Italian coffee' },
                      price: { type: 'number', example: 3.5 },
                      image_url: {
                        type: 'string',
                        example: 'https://example.com/image.jpg',
                      },
                      is_available: { type: 'boolean', example: true },
                      details: { type: 'string', example: 'Single shot, hot' },
                    },
                  },
                },
              },
            },
          },
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
        FreeTrial3: {
          summary: 'Example of restaurant FreeTrail3 with all fields',
          value: {
            name: 'free trial3',
            banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
            address: 'Argentina, Posadas, Misiones, N3300, Argentina',
            phone: null,
            description: null,
            tags: ['Vegan', 'Vegetariano'],
            subscriptionId: '456fe464-7131-4371-b281-f427a1de820e',
            trading_hours: null,
            ordering_times: null,
            isTrial: false,
            longitude: '-55.935053',
            latitude: '-27.421255',
            is_active: true,
            exist: true,
          },
        },
        EliCafe: {
          summary: 'Example of restaurant EliCafe with all fields',
          value: {
            name: 'Eli Cafe',
            banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1748236814/banners/touzqyjfxwn6uua3xrzi.jpg',
            address: 'Argentina, Posadas, Misiones, N3300, Argentina',
            phone: '1111111',
            description: 'Authentic Colombian coffee, artisan pastries, and a warm, cozy atmosphere — your perfect coffee break starts here.',
            tags: ['Coffee Specialties', 'Breakfast & Brunch'],
            subscriptionId: null,
            trading_hours: {
              sunday: {
                open: '',
                close: '',
              },
              saturday: {
                open: '',
                close: '',
              },
              mondayToFriday: {
                open: '12:20',
                close: '18:26',
              },
            },
            ordering_times: {
              dinein: '',
              pickup: '20',
            },
            latitude: '-27.421255',
            longitude: '-55.935053',
            isTrial: false,
            is_active: true,
            exist: true,
          },
        },
        FreeTrail: {
          summary: 'Example of restaurant FreeTrail with all fields',
          value: {
            name: 'Free Trail',
            banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
            address: 'Colonial Place, Grand Falls-Windsor, Newfoundland and Labrador A2B 1E2, Canada',
            phone: '3232323232',
            description: 'Grand Falls-Windsor 5 Stars Hotel',
            tags: ['Italian & Pizza'],
            subscriptionId: '3b6dc820-ef13-4c35-9d50-b824f05b8535',
            trading_hours: null,
            ordering_times: null,
            isTrial: true,
            latitude: '48.950815',
            longitude: '-55.666373',
            is_active: true,
            exist: true,
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

//PatchRestaurantBySlugDoc
export function DeleteRestaurantBySlugDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete Name and Onwers email for a Restaurant',
      description: 'De-activates the restaurant. You should provide SLUG to access the data',
    }),

    ApiResponse({
      status: 200,
      description: 'Restaurant successfully Delete',
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
      description: 'Invalid data or slug dont exist',
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
