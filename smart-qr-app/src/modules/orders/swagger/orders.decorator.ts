import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

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

export function CreateOrderDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({ summary: 'Create a new order' }),
    ApiBody({
      type: CreateOrderDto,
      description: 'Order data including customer, table, and order items',
    }),
    ApiResponse({ status: 201, description: 'Order created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid data' }),
  );
}

export function GetAllOrdersDoc() {
  return applyDecorators(SlugParam, ApiOperation({ summary: 'Get all orders for the restaurant' }), ApiResponse({ status: 200, description: 'List of orders' }));
}

export function GetOrderByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Get order by ID' }),
    ApiResponse({ status: 200, description: 'Order found' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}

export function UpdateOrderDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Update an order' }),
    ApiBody({ type: UpdateOrderDto }),
    ApiResponse({ status: 200, description: 'Order updated successfully' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}

export function DeleteOrderDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Delete an order' }),
    ApiResponse({ status: 200, description: 'Order deleted successfully' }),
    ApiResponse({ status: 404, description: 'Order not found' }),
  );
}
