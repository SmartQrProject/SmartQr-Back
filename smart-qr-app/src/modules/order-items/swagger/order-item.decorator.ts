import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBody, ApiResponse } from '@nestjs/swagger';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

// 🔁 Reutilizables
const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'test-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Order item ID',
  example: '123e4567-e89b-12d3-a456-426614174002',
});

const UnauthorizedResponse = ApiResponse({
  status: 401,
  description: 'Unauthorized access',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
});

const NotFoundResponse = (message = ['Restaurant not found']) =>
  ApiResponse({
    status: 404,
    description: 'Resource not found',
    schema: {
      example: {
        statusCode: 404,
        message,
        error: 'Not Found',
      },
    },
  });

const BadRequestResponse = ApiResponse({
  status: 400,
  description: 'Invalid data provided',
  schema: {
    example: {
      statusCode: 400,
      message: ['Product is not available', 'Quantity must be greater than 0'],
      error: 'Bad Request',
    },
  },
});

// ✅ Decoradores

export const CreateOrderItemDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Create a new order item' }),
    SlugParam,
    ApiBody({
      type: CreateOrderItemDto,
      description: 'Order item data to create',
      examples: {
        example1: {
          value: {
            orderId: '...',
            productId: '...',
            quantity: 2,
            unit_price: 15.99,
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Order item created successfully' }),
    BadRequestResponse,
    NotFoundResponse(['Restaurant not found', 'Order not found', 'Product not found']),
    UnauthorizedResponse,
  );

export const GetAllOrderItemsDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get all order items' }),
    SlugParam,
    ApiResponse({ status: 200, description: 'List retrieved' }),
    NotFoundResponse(),
    UnauthorizedResponse,
  );

export const GetOrderItemByIdDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Get order item by ID' }),
    SlugParam,
    IdParam,
    ApiResponse({ status: 200, description: 'Order item retrieved' }),
    NotFoundResponse(['Restaurant not found', 'Order item not found']),
    UnauthorizedResponse,
  );

export const UpdateOrderItemDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Update an order item' }),
    SlugParam,
    IdParam,
    ApiBody({
      type: UpdateOrderItemDto,
      description: 'Order item data to update',
    }),
    ApiResponse({ status: 200, description: 'Order item updated successfully' }),
    BadRequestResponse,
    NotFoundResponse(['Restaurant not found', 'Order item not found', 'Product not found']),
    UnauthorizedResponse,
  );

export const DeleteOrderItemDoc = () =>
  applyDecorators(
    ApiOperation({ summary: 'Delete an order item' }),
    SlugParam,
    IdParam,
    ApiResponse({
      status: 200,
      description: 'Order item deleted successfully',
    }),
    NotFoundResponse(['Restaurant not found', 'Order item not found']),
    UnauthorizedResponse,
  );
