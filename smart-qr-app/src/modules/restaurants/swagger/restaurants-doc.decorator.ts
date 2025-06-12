import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth, ApiOkResponse, ApiParam } from '@nestjs/swagger';
import { CreateRestaurantsDto } from '../dto/create-restaurants.dto';
import { CreateRestaurantsExistingDto } from '../dto/create-restaurants-existing.dto';
import { PatchRestaurantsDto } from '../dto/patch-restaurants.dto';

export function CreateRestaurantDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new Restaurant',
      description: 'Creates a new restaurant and its owner user. The slug must be unique and will be used as identifier in URLs.',
    }),
    ApiBody({
      type: CreateRestaurantsDto,
      description:
        'Restaurant data. If owner_email belongs to an existing user, only name, slug, owner_email and isTrial are required.',
      examples: {
        eliCafe: {
          summary: 'Example of restaurant creation',
          value: {
            name: 'Eli Cafe',
            slug: 'eli-cafe',
            owner_name: 'John Smith',
            owner_email: 'smartqr2@gmail.com',
            owner_pass: 'Clave123$$',
            isTrial: false,
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
          name: 'Eli Cafe',
          slug: 'eli-cafe',
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

export function CreateRestaurantExistingDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a restaurant for an existing owner',
      description:
        'Creates a new restaurant and assigns it to an already registered owner user.',
    }),
    ApiBody({
      type: CreateRestaurantsExistingDto,
      description: 'Restaurant data for existing owner',
      examples: {
        eliCafe: {
          summary: 'Example of restaurant creation for existing owner',
          value: {
            name: 'Eli Cafe',
            slug: 'eli-cafe',
            owner_email: 'smartqr2@gmail.com',
            isTrial: false,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant successfully created',
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
      description: 'Retrieves restaurant data and its categories/products using its unique slug. Requires Owner or SuperAdmin role.',
    }),
    ApiQuery({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant found successfully',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Eli Cafe',
          slug: 'eli-cafe',
          owner_email: 'smartqr2@gmail.com',
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:34:56.789Z',
          exist: true,
          is_active: true,
          banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
          address: 'Argentina, Posadas, Misiones, N3300, Argentina',
          phone: '1111111',
          description: 'Authentic Colombian coffee, artisan pastries, and a warm, cozy atmosphere',
          tags: ['Coffee Specialties', 'Breakfast & Brunch'],
          trading_hours: {
            mondayToFriday: { open: '12:20', close: '18:26' },
            saturday: { open: '', close: '' },
            sunday: { open: '', close: '' },
          },
          ordering_times: {
            dinein: '',
            pickup: '20',
          },
          latitude: '-27.421255',
          longitude: '-55.935053',
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
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function GetRestaurantPublicDoc() {
  return applyDecorators(
    ApiParam({
      name: 'slug',
      required: true,
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
    }),
    ApiOperation({
      summary: 'Get public data of a restaurant by slug',
      description: 'Retrieves public data of a restaurant including address, contact, categories and products. No authentication required.',
    }),
    ApiResponse({
      status: 200,
      description: 'Returns public restaurant information including categories and products',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Eli Cafe' },
          slug: { type: 'string', example: 'eli-cafe' },
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

export function PatchRestaurantBySlugDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update restaurant information',
      description:
        'Updates restaurant information. Requires Owner or SuperAdmin role. The following fields can be updated: name, banner, address, phone, description, tags, trading_hours, ordering_times, longitude, latitude, is_active',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
      required: true,
    }),
    ApiBody({
      type: PatchRestaurantsDto,
      description: 'Restaurant data to update',
      examples: {
        eliCafe: {
          summary: 'Example of restaurant update',
          value: {
            name: 'Eli Cafe',
            banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
            address: 'Argentina, Posadas, Misiones, N3300, Argentina',
            phone: '1111111',
            description: 'Authentic Colombian coffee, artisan pastries, and a warm, cozy atmosphere — your perfect coffee break starts here.',
            tags: ['Coffee Specialties', 'Breakfast & Brunch'],
            trading_hours: {
              sunday: { open: '', close: '' },
              saturday: { open: '', close: '' },
              mondayToFriday: { open: '12:20', close: '18:26' },
            },
            ordering_times: {
              dinein: '',
              pickup: '20',
            },
            latitude: '-27.421255',
            longitude: '-55.935053',
            is_active: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant successfully updated',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Eli Cafe',
          slug: 'eli-cafe',
          owner_email: 'smartqr2@gmail.com',
          banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
          address: 'Argentina, Posadas, Misiones, N3300, Argentina',
          phone: '1111111',
          description: 'Authentic Colombian coffee, artisan pastries, and a warm, cozy atmosphere',
          tags: ['Coffee Specialties', 'Breakfast & Brunch'],
          trading_hours: {
            mondayToFriday: { open: '12:20', close: '18:26' },
            saturday: { open: '', close: '' },
            sunday: { open: '', close: '' },
          },
          ordering_times: {
            dinein: '',
            pickup: '20',
          },
          latitude: '-27.421255',
          longitude: '-55.935053',
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:34:56.789Z',
          exist: true,
          is_active: true,
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Invalid data' }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function DeleteRestaurantBySlugDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a restaurant',
      description: 'De-activates the restaurant. Requires SuperAdmin role.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Restaurant successfully deleted',
      schema: {
        example: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          name: 'Eli Cafe',
          slug: 'eli-cafe',
          owner_email: 'smartqr2@gmail.com',
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:34:56.789Z',
          exist: true,
          is_active: false,
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Invalid data or slug does not exist' }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
  );
}

export const GetAllRestaurantsDoc = () =>
  applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all restaurants',
      description: 'Returns all registered restaurants with basic info. Requires SuperAdmin role.',
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
            owner_email: { type: 'string', format: 'email', example: 'smartqr2@gmail.com' },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', format: 'date-time', example: '2024-03-20T12:34:56.789Z' },
            subscription: { type: 'string', nullable: true, example: null },
            exist: { type: 'boolean', example: true },
            banner: {
              type: 'string',
              format: 'uri',
              example: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1747862758/lovmpbsgq7ymbzyib5zv.png',
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
  );
