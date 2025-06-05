import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBody, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';

const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'eli-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Order ID',
  example: '2cf84bac-dcf0-44a3-a643-2cd7101dc617',
});

export function CreateOrderDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({
      summary: 'Create a new order',
      description: 'Creates a new order for a restaurant. Requires Auth0 authentication.',
    }),
    ApiBody({
      type: CreateOrderDto,
      description: 'Order creation payload including customer ID, table code, and products',
      examples: {
        exampleOrder: {
          summary: 'Example order with products and reward code',
          value: {
            customerId: 'db7f9399-3617-47b9-b247-dc1bc3da5ff7',
            code: 'Ext-01',
            products: [
              {
                id: 'ad3dd3f4-c1e0-4564-afb1-7be6e0558fc6', // Product ID
                quantity: 2,
              },
              {
                id: '5cd6eae2-abb5-42ab-b229-422e787b949d', // Product ID
                quantity: 1,
              },
            ],
            rewardCode: 'WELCOME10', // Optional reward code
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Order created successfully',
      schema: {
        example: {
          id: '95a6d2c6-3ffb-4df8-9544-9cc7aaa98db2',
          status: 'pending',
          payStatus: 'unpaid',
          order_type: 'dine-in',
          total_price: 25.5,
          payment_method: null,
          discount_applied: 0,
          served_at: null,
          created_at: '2024-03-20T12:34:56.789Z',
          rewardCode: 'WELCOME10',
          exist: true,
          customer: {
            id: 'b0b2b7d3-e166-4d44-9838-a088bf2822dd',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
          },
          items: [
            {
              product: {
                id: 'f620503f-1c92-4ccb-b1cd-fac3bc3ccb5a',
                name: 'Cappuccino',
                description: 'Italian coffee drink',
                price: 8.5,
              },
              quantity: 2,
              unit_price: 8.5,
            },
          ],
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Invalid data, products not found, or products not available' }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid Auth0 token' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function GetAllOrdersDoc() {
  return applyDecorators(
    SlugParam,
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get all orders for a restaurant',
      description: 'Retrieves all orders for a restaurant. Requires Owner or Staff role.',
    }),
    ApiOkResponse({
      description: 'List of orders with customer and product details',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '8471b9cf-af7a-4eab-ab80-7bfcf6408349' },
            status: { type: 'string', enum: ['pending', 'in-process', 'ready', 'completed'], example: 'pending' },
            payStatus: { type: 'string', enum: ['unpaid', 'paid', 'refunded'], example: 'unpaid' },
            order_type: { type: 'string', enum: ['dine-in', 'pickup', 'delivery'], example: 'dine-in' },
            total_price: { type: 'number', example: 25.5 },
            payment_method: { type: 'string', nullable: true, example: null },
            discount_applied: { type: 'number', example: 0 },
            served_at: { type: 'string', format: 'date-time', nullable: true, example: null },
            created_at: { type: 'string', format: 'date-time', example: '2024-03-20T12:34:56.789Z' },
            rewardCode: { type: 'string', nullable: true, example: 'WELCOME10' },
            exist: { type: 'boolean', example: true },
            customer: {
              type: 'object',
              properties: {
                id: { type: 'string', example: '4eba551d-eb65-4fef-8aeb-df771c1cb1b9' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                phone: { type: 'string', example: '+1234567890' },
              },
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '5536bf9e-71c8-4780-a27b-b8e9d94d55b8' },
                      name: { type: 'string', example: 'Cappuccino' },
                      description: { type: 'string', example: 'Italian coffee drink' },
                      price: { type: 'number', example: 8.5 },
                    },
                  },
                  quantity: { type: 'integer', example: 2 },
                  unit_price: { type: 'number', example: 8.5 },
                },
              },
            },
          },
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function GetOrderByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get order by ID',
      description: 'Retrieves a specific order by its ID. Requires Owner or Staff role.',
    }),
    ApiResponse({
      status: 200,
      description: 'Order found',
      schema: {
        example: {
          id: '76758b97-1777-4171-b381-9f8c52908caa',
          status: 'pending',
          payStatus: 'unpaid',
          order_type: 'dine-in',
          total_price: 25.5,
          payment_method: null,
          discount_applied: 0,
          served_at: null,
          created_at: '2024-03-20T12:34:56.789Z',
          rewardCode: 'WELCOME10',
          exist: true,
          customer: {
            id: 'b0b2b7d3-e166-4d44-9838-a088bf2822dd',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890',
          },
          items: [
            {
              product: {
                id: 'd6922c2b-f5df-4078-835b-56db2af811a2',
                name: 'Cappuccino',
                description: 'Italian coffee drink',
                price: 8.5,
              },
              quantity: 2,
              unit_price: 8.5,
            },
          ],
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}

export function UpdateOrderDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update order status',
      description: 'Updates the status of an order. Requires Owner or Staff role.',
    }),
    ApiBody({
      type: UpdateOrderDto,
      description: 'Order status update',
      examples: {
        statusUpdate: {
          summary: 'Update order status',
          value: {
            status: 'in-process', // Possible values: pending, in-process, ready, completed
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Order updated successfully',
      schema: {
        example: {
          id: '76758b97-1777-4171-b381-9f8c52908caa',
          status: 'in-process',
          payStatus: 'unpaid',
          order_type: 'dine-in',
          total_price: 25.5,
          payment_method: null,
          discount_applied: 0,
          served_at: null,
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:35:00.000Z',
          rewardCode: 'WELCOME10',
          exist: true,
        },
      },
    }),
    ApiResponse({ status: 400, description: 'Invalid status value. Must be one of: pending, in-process, ready, completed' }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}

export function DeleteOrderDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete an order',
      description: 'Soft deletes an order by setting exist=false. Requires Owner or Staff role.',
    }),
    ApiResponse({
      status: 200,
      description: 'Order deleted successfully',
      schema: {
        example: {
          id: '76758b97-1777-4171-b381-9f8c52908caa',
          status: 'pending',
          exist: false,
          updated_at: '2024-03-20T12:35:00.000Z',
        },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}
