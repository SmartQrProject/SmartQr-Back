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
  example: 'xxxxx',
});

export function CreateOrderDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({ 
      summary: 'Create a new order',
      description: 'Creates a new order for a restaurant. Requires Auth0 authentication.'
    }),
    ApiBody({
      type: CreateOrderDto,
      description: 'Order creation payload including customer ID, table code, and products',
      examples: {
        exampleOrder: {
          summary: 'Example order with products and reward code',
          value: {
            customerId: 'xxxxx',
            code: 'T001',
            products: [
              {
                id: 'xxxxx',  // Product ID
                quantity: 2
              },
              {
                id: 'xxxxx',  // Product ID
                quantity: 1
              }
            ],
            rewardCode: 'WELCOME10'  // Optional reward code
          },
        },
      },
    }),
    ApiResponse({ 
      status: 201, 
      description: 'Order created successfully',
      schema: {
        example: {
          id: 'xxxxx',
          status: 'pending',
          payStatus: 'unpaid',
          order_type: 'dine-in',
          total_price: 25.50,
          payment_method: null,
          discount_applied: 0,
          served_at: null,
          created_at: '2024-03-20T12:34:56.789Z',
          rewardCode: 'WELCOME10',
          exist: true,
          customer: {
            id: 'xxxxx',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          },
          items: [
            {
              product: {
                id: 'xxxxx',
                name: 'Cappuccino',
                description: 'Italian coffee drink',
                price: 8.50
              },
              quantity: 2,
              unit_price: 8.50
            }
          ]
        }
      }
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
      description: 'Retrieves all orders for a restaurant. Requires Owner or Staff role.'
    }),
    ApiOkResponse({
      description: 'List of orders with customer and product details',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'xxxxx' },
            status: { type: 'string', enum: ['pending', 'in-process', 'ready', 'completed'], example: 'pending' },
            payStatus: { type: 'string', enum: ['unpaid', 'paid', 'refunded'], example: 'unpaid' },
            order_type: { type: 'string', enum: ['dine-in', 'pickup', 'delivery'], example: 'dine-in' },
            total_price: { type: 'number', example: 25.50 },
            payment_method: { type: 'string', nullable: true, example: null },
            discount_applied: { type: 'number', example: 0 },
            served_at: { type: 'string', format: 'date-time', nullable: true, example: null },
            created_at: { type: 'string', format: 'date-time', example: '2024-03-20T12:34:56.789Z' },
            rewardCode: { type: 'string', nullable: true, example: 'WELCOME10' },
            exist: { type: 'boolean', example: true },
            customer: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'xxxxx' },
                name: { type: 'string', example: 'John Doe' },
                email: { type: 'string', example: 'john@example.com' },
                phone: { type: 'string', example: '+1234567890' }
              }
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'xxxxx' },
                      name: { type: 'string', example: 'Cappuccino' },
                      description: { type: 'string', example: 'Italian coffee drink' },
                      price: { type: 'number', example: 8.50 }
                    }
                  },
                  quantity: { type: 'integer', example: 2 },
                  unit_price: { type: 'number', example: 8.50 }
                }
              }
            }
          }
        }
      }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' })
  );
}

export function GetOrderByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Get order by ID',
      description: 'Retrieves a specific order by its ID. Requires Owner or Staff role.'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Order found',
      schema: {
        example: {
          id: 'xxxxx',
          status: 'pending',
          payStatus: 'unpaid',
          order_type: 'dine-in',
          total_price: 25.50,
          payment_method: null,
          discount_applied: 0,
          served_at: null,
          created_at: '2024-03-20T12:34:56.789Z',
          rewardCode: 'WELCOME10',
          exist: true,
          customer: {
            id: 'xxxxx',
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+1234567890'
          },
          items: [
            {
              product: {
                id: 'xxxxx',
                name: 'Cappuccino',
                description: 'Italian coffee drink',
                price: 8.50
              },
              quantity: 2,
              unit_price: 8.50
            }
          ]
        }
      }
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
      description: 'Updates the status of an order. Requires Owner or Staff role.'
    }),
    ApiBody({ 
      type: UpdateOrderDto,
      description: 'Order status update',
      examples: {
        statusUpdate: {
          summary: 'Update order status',
          value: {
            status: 'in-process'  // Possible values: pending, in-process, ready, completed
          }
        }
      }
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Order updated successfully',
      schema: {
        example: {
          id: 'xxxxx',
          status: 'in-process',
          payStatus: 'unpaid',
          order_type: 'dine-in',
          total_price: 25.50,
          payment_method: null,
          discount_applied: 0,
          served_at: null,
          created_at: '2024-03-20T12:34:56.789Z',
          updated_at: '2024-03-20T12:35:00.000Z',
          rewardCode: 'WELCOME10',
          exist: true
        }
      }
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
      description: 'Soft deletes an order by setting exist=false. Requires Owner or Staff role.'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Order deleted successfully',
      schema: {
        example: {
          id: 'xxxxx',
          status: 'pending',
          exist: false,
          updated_at: '2024-03-20T12:35:00.000Z'
        }
      }
    }),
    ApiResponse({ status: 401, description: 'Unauthorized - Missing or invalid token' }),
    ApiResponse({ status: 403, description: 'Forbidden - User does not have required role' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}
