import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderResponseDto } from '../dto/order-response.dto';

// 🔁 Reutilizables
const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'test-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Order ID',
  example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
});

const NotFoundOrder = ApiResponse({ status: 404, description: 'Order not found' });
const Order200 = ApiResponse({ status: 200, description: 'Order found' });

// ✅ Decoradores

export function CreateOrderDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({ summary: 'Create a new order-only works with AUTH0 token' }),
    ApiBody({
      type: CreateOrderDto,
      description: 'Payload required to create a new order, including optional client ID, table ID, and the list of ordered products with quantities.',
      examples: {
        exampleOrder: {
          summary: 'Order with client and products',
          value: {
            customerId: '05f67a0f-0d2c-4119-927a-9e1047d2851d',
            code: 'T07',
            rewardCode: 'KDB38D35JV',
            products: [
              { id: '1c64190d-3c81-43db-b8a3-40e4d768b42a', quantity: 2 },
              { id: '2cea0878-d961-4d53-af44-197022bcfead', quantity: 1 },
            ],
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Order created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid data' }),
  );
}

export function GetAllOrdersDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all orders for a restaurant by slug' }),
    ApiOkResponse({
      description: 'List of orders with basic customer and product info',
      type: [OrderResponseDto],
    }),
  );
}

export function GetOrderByIdDoc() {
  return applyDecorators(SlugParam, IdParam, ApiOperation({ summary: 'Get order by ID' }), Order200, NotFoundOrder);
}

export function UpdateOrderDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Update an order' }),
    ApiBody({ type: UpdateOrderDto }),
    ApiResponse({ status: 200, description: 'Order updated successfully' }),
    NotFoundOrder,
  );
}

export function DeleteOrderDoc() {
  return applyDecorators(SlugParam, IdParam, ApiOperation({ summary: 'Delete an order' }), ApiResponse({ status: 200, description: 'Order deleted successfully' }), NotFoundOrder);
}
