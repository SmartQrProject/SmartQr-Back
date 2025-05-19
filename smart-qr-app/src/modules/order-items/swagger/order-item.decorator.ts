import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateOrderItemDto } from '../dto/create-order-item.dto';
import { UpdateOrderItemDto } from '../dto/update-order-item.dto';

export const CreateOrderItemDoc = () => {
  return applyDecorators(
    ApiOperation({ summary: 'Crear un nuevo item de orden' }),
    ApiParam({
      name: 'slug',
      description: 'Slug del restaurante',
      example: 'test-cafe',
    }),
    ApiBody({
      type: CreateOrderItemDto,
      description: 'Datos del item de orden a crear',
      examples: {
        example1: {
          value: {
            orderId: '123e4567-e89b-12d3-a456-426614174000',
            productId: '123e4567-e89b-12d3-a456-426614174001',
            quantity: 2,
            unit_price: 15.99,
          },
          summary: 'Ejemplo de creación de item de orden para test-cafe',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'El item de orden ha sido creado exitosamente',
      schema: {
        example: {
          message: 'Item de orden creado exitosamente',
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
              name: 'Producto Ejemplo',
              price: 15.99,
              is_available: true,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: ['El producto no está disponible', 'La cantidad debe ser mayor a 0'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurante no encontrado', 'Orden no encontrada', 'Producto no encontrado'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
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
    ApiOperation({ summary: 'Obtener todos los items de orden' }),
    ApiParam({
      name: 'slug',
      description: 'Slug del restaurante',
      example: 'test-cafe',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de items de orden obtenida exitosamente',
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
              name: 'Producto Ejemplo',
              price: 15.99,
              is_available: true,
            },
          },
        ],
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurante no encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: 'Restaurante no encontrado',
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
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
    ApiOperation({ summary: 'Obtener un item de orden por su ID' }),
    ApiParam({
      name: 'slug',
      description: 'Slug del restaurante',
      example: 'test-cafe',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del item de orden',
      example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    ApiResponse({
      status: 200,
      description: 'Item de orden encontrado exitosamente',
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
            name: 'Producto Ejemplo',
            price: 15.99,
            is_available: true,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurante no encontrado', 'Item de orden no encontrado'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
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
    ApiOperation({ summary: 'Actualizar un item de orden' }),
    ApiParam({
      name: 'slug',
      description: 'Slug del restaurante',
      example: 'test-cafe',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del item de orden',
      example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    ApiBody({
      type: UpdateOrderItemDto,
      description: 'Datos del item de orden a actualizar',
      examples: {
        example1: {
          value: {
            quantity: 3,
            unit_price: 16.99,
            productId: '123e4567-e89b-12d3-a456-426614174001',
          },
          summary: 'Ejemplo de actualización de item de orden para test-cafe',
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Item de orden actualizado exitosamente',
      schema: {
        example: {
          message: 'Item de orden actualizado exitosamente',
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
              name: 'Producto Ejemplo',
              price: 16.99,
              is_available: true,
            },
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Datos inválidos',
      schema: {
        example: {
          statusCode: 400,
          message: ['El producto no está disponible', 'La cantidad debe ser mayor a 0'],
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurante no encontrado', 'Item de orden no encontrado', 'Producto no encontrado'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
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
    ApiOperation({ summary: 'Eliminar un item de orden' }),
    ApiParam({
      name: 'slug',
      description: 'Slug del restaurante',
      example: 'test-cafe',
    }),
    ApiParam({
      name: 'id',
      description: 'ID del item de orden',
      example: '123e4567-e89b-12d3-a456-426614174002',
    }),
    ApiResponse({
      status: 200,
      description: 'Item de orden eliminado exitosamente',
      schema: {
        example: {
          message: 'Item de orden eliminado exitosamente',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Recurso no encontrado',
      schema: {
        example: {
          statusCode: 404,
          message: ['Restaurante no encontrado', 'Item de orden no encontrado'],
          error: 'Not Found',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'No autorizado',
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
