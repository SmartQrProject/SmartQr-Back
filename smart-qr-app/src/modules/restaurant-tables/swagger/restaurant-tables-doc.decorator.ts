import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateRestaurantTableDto } from '../dto/update-restaurant-table.dto';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';

// Decorador reutilizable de slug
const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'eli-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Table ID',
  example: '4a176832-c856-483f-9f6f-4c179c525664',
});

export function FindAllTablesDoc() {
  return applyDecorators(
    ApiBearerAuth(),
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
      schema: {
        example: {
          page: 1,
          limit: 5,
          restaurantTables: [
            {
              id: '4a176832-c856-483f-9f6f-4c179c525664',
              code: 'Salon-01',
              is_active: true,
              exist: true,
              created_at: '2025-06-04T11:13:56.658Z',
            },
            {
              id: '966fda39-b946-4bb7-ada6-6814bd1d2303',
              code: 'Salon-02',
              is_active: true,
              exist: true,
              created_at: '2025-06-04T11:13:56.658Z',
            },
          ],
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant with this slug not found',
    }),
    ApiResponse({
      status: 404,
      description: 'You can not visualize Tables from other restaurants.',
    }),
    ApiResponse({
      status: 404,
      description: '❌ No Tables found for this restaurant "eli-cafe".',
    }),
  );
}

export function SeederTablesDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    ApiParam({
      name: 'qty',
      description: 'Numbers of tables to be created',
      example: 10,
    }),
    ApiParam({
      name: 'prefix',
      description: 'Identifier of the tables',
      example: 'Salon',
    }),
    ApiOperation({
      summary: 'Generate a number of tables based on the qty of tables needed and a prefix to call them. Sends email to Restaurant Owner.',
      description: 'Example Qty = 5, Prefix = MesaSalon then it will create automatically MesaSalon01, MesaSalon02....',
    }),
    ApiResponse({
      status: 200,
      description: 'List of tables',
      schema: {
        example: [
          {
            code: 'Exterior-02',
            restaurant: {
              id: '65ea439a-a616-4097-8ed3-4211bd450c17',
              name: 'Riviera Cafe',
              slug: 'riviera',
              owner_email: 'amigogabrielernesto@gmail.com',
              is_active: true,
              created_at: '2025-06-03T16:18:39.487Z',
              categories: [
                {
                  id: '6e553287-23b9-42a1-b016-353d68871c51',
                  name: 'Bebidas',
                  created_at: '2025-06-03T16:20:46.577Z',
                  sequenceNumber: 0,
                  products: [
                    {
                      id: 'bf3dc874-c9e0-4f01-b268-fd804edf8269',
                      sequenceNumber: 0,
                      name: 'Coca Cola 350',
                      description: 'Coca Cola 350',
                      price: '4.00',
                      image_url: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1748967801/oktiqkdtahfqms2cjzf0.png',
                      is_available: true,
                      cost_price: null,
                      details: [],
                      category: {
                        id: '6e553287-23b9-42a1-b016-353d68871c51',
                        name: 'Bebidas',
                        created_at: '2025-06-03T16:20:46.577Z',
                        sequenceNumber: 0,
                        exist: true,
                      },
                      created_at: '2025-06-03T16:23:22.281Z',
                      exist: true,
                    },
                  ],
                  exist: true,
                },
              ],
              subscription: {
                id: '952bdc2d-089d-4a85-9fae-71c540866c23',
                stripeSubscriptionId: 'sub_1RVxYGGhU7wXEtY4BhyCQfYX',
                customerId: 'cus_SQpChYJSqkkUkB',
                status: 'trialing',
                plan: 'price_1RNXoLGhU7wXEtY4Htr33Caa',
                currentPeriodEnd: '2025-06-17T16:18:59.000Z',
                createdAt: '2025-06-03T16:19:04.264Z',
                exist: true,
                isTrial: true,
                cancelAtPeriodEnd: false,
              },
              exist: true,
              banner: 'https://res.cloudinary.com/dsrcokjsp/image/upload/v1748967626/banners/ify9hhuxryue4601ofde.jpg',
              address: null,
              phone: '+5491144093627',
              description: 'Almacen de Pizzas',
              tags: ['Pizza'],
              trading_hours: null,
              ordering_times: null,
              latitude: null,
              longitude: null,
              wasTrial: true,
            },
            id: 'cbffc2dd-54fa-4dfd-ad93-164c047ab407',
            is_active: true,
            exist: true,
            created_at: '2025-06-04T11:23:27.668Z',
          },
        ],
      },
    }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
    ApiResponse({ status: 400, description: ' ❌ The number of tables shoud be less than 100 for this restaurant' }),
    ApiResponse({ status: 404, description: 'You can NOT create  Tables for other restaurants' }),
  );
}

export function FindTableByIdDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Retrieve a table definition by its ID.',
      description: 'Retrieve a table definition by its ID for a defined Restaurant.',
    }),
    ApiResponse({ status: 200, description: 'Table found and returned' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
    ApiResponse({ status: 404, description: 'You can NOT visualize Tables from other restaurants.' }),
    ApiResponse({ status: 404, description: '❌ No Tables found for this restaurant "eli-cafe"' }),
  );
}

export function DeleteTableDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Delete a table by ID',
      description: 'Deactivates a table for a defined Restaurant.Sends email to Restaurant Owner.',
    }),
    ApiOkResponse({
      type: RestaurantTable,
      description: 'Table deactivated successfully',
    }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
    ApiResponse({ status: 404, description: `You can NOT visualize Tables from other restaurants.` }),
  );
}

export function UpdateTableDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Update a restaurant table by ID. Sends email to Restaurant Owner.' }),
    ApiBody({ type: UpdateRestaurantTableDto }),
    ApiResponse({ status: 200, description: 'Table updated successfully' }),
    ApiResponse({ status: 404, description: 'Restaurant or table not found' }),
    ApiResponse({ status: 404, description: `You can NOT visualize Tables from other restaurants.` }),
  );
}
