import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

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

export const CreateOrderItemDoc = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new order item' }),
    SlugParam,
    ApiBody({
      type: CreateOrderItemDto,
      description: 'Order item data to create',
      examples: {
        example1: {
          value: {
            orderId: '123e4567-e89b-12d3-a456-426614174000',
            productId: '123e4567-e89b-12d3-a456-426614174001',
            quantity: 2,
            unit_price: 15.99,
          },
          summary: 'Example of creating an order item for test-cafe',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Order item created successfully',
      schema: {
        example: {
          message: 'Order item created successfully',
          orderItem: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            quantity: 2,
            unit_price: 15.99,
            exist: true,
            order: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              total_price: 31.98,
              exist: true,
            },
            product: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'Example Product',
              price: 15.99,
              is_available: true,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid data provided',
      schema: {
        example: {
          statusCode: 400,
          message: ['Product is not available', 'Quantity must be greater than 0'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurant not found', 'Order not found', 'Product not found'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
};

export const GetAllOrderItemsDoc = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get all order items' }),
    SlugParam,
    ApiResponse({
      status: 200,
      description: 'List of order items retrieved successfully',
      schema: {
        example: [
          {
            id: '123e4567-e89b-12d3-a456-426614174002',
            quantity: 2,
            unit_price: 15.99,
            exist: true,
            order: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              total_price: 31.98,
              exist: true,
            },
            product: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'Example Product',
              price: 15.99,
              is_available: true,
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Restaurant not found',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
};

export const GetOrderItemByIdDoc = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Get order item by ID' }),
    SlugParam,
    IdParam,
    ApiResponse({
      status: 200,
      description: 'Order item retrieved successfully',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          quantity: 2,
          unit_price: 15.99,
          exist: true,
          order: {
            id: '123e4567-e89b-12d3-a456-426614174000',
            total_price: 31.98,
            exist: true,
          },
          product: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            name: 'Example Product',
            price: 15.99,
            is_available: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurant not found', 'Order item not found'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
};

export const UpdateOrderItemDoc = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Update an order item' }),
    SlugParam,
    IdParam,
    ApiBody({
      type: UpdateOrderItemDto,
      description: 'Order item data to update',
      examples: {
        example1: {
          value: {
            quantity: 3,
            unit_price: 16.99,
            productId: '123e4567-e89b-12d3-a456-426614174001',
          },
          summary: 'Example of updating an order item for test-cafe',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Order item updated successfully',
      schema: {
        example: {
          message: 'Order item updated successfully',
          orderItem: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            quantity: 3,
            unit_price: 16.99,
            exist: true,
            order: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              total_price: 50.97,
              exist: true,
            },
            product: {
              id: '123e4567-e89b-12d3-a456-426614174001',
              name: 'Example Product',
              price: 16.99,
              is_available: true,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid data provided',
      schema: {
        example: {
          statusCode: 400,
          message: ['Product is not available', 'Quantity must be greater than 0'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurant not found', 'Order item not found', 'Product not found'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
};

export const DeleteOrderItemDoc = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Delete an order item' }),
    SlugParam,
    IdParam,
    ApiResponse({
      status: 200,
      description: 'Order item deleted successfully',
      schema: {
        example: {
          message: 'Order item deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Resource not found',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurant not found', 'Order item not found'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized access',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
  );
};
