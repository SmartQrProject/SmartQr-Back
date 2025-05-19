import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export function CreateCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new category',
      description: 'Creates a new category for the restaurant menu. Requires owner authentication.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique identifier of the restaurant',
      example: 'test-cafe',
      required: true,
    }),
    ApiBody({
      type: CreateCategoryDto,
      description: 'New category data',
      examples: {
        beverages: {
          value: {
            name: 'Beverages',
          },
          summary: 'Beverages category for Test Cafe',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Category successfully created',
      schema: {
        example: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Beverages',
          created_at: '2024-03-20T15:30:00.000Z',
          updated_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 1,
          exist: true,
          products: [],
          restaurant: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Test Cafe',
            slug: 'test-cafe',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant not found',
      schema: {
        example: {
          message: 'Restaurant with slug test-cafe not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
    ApiResponse({
      status: 409,
      description: 'Category name already exists',
      schema: {
        example: {
          message: 'Ya existe una categoría con el nombre "Beverages" en este restaurante',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    }),
  );
}

export function GetAllCategoriesDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all categories for the restaurant',
      description: 'Retrieves a paginated list of categories with their products for a specific restaurant.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 10)',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description: 'Categories found successfully',
      schema: {
        example: {
          categories: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Beverages',
              created_at: '2024-03-20T15:30:00.000Z',
              updated_at: '2024-03-20T15:30:00.000Z',
              sequenceNumber: 1,
              exist: true,
              products: [
                {
                  id: 'abc12345-e89b-12d3-a456-426614174000',
                  name: 'Coca Cola',
                  price: 2.5,
                  description: 'Regular Coca Cola',
                  image_url: 'https://example.com/coca-cola.jpg',
                  exist: true,
                },
              ],
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Restaurant not found',
      schema: {
        example: {
          message: 'Restaurant with slug test-cafe not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

export function GetCategoryByIdDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get category by ID',
      description: 'Retrieves a specific category and its products for a restaurant using the category ID and restaurant slug.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
    }),
    ApiResponse({
      status: 200,
      description: 'Category found successfully',
      schema: {
        example: {
          id: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
          name: 'Beverages',
          created_at: '2024-03-20T15:30:00.000Z',
          updated_at: '2024-03-20T15:30:00.000Z',
          sequenceNumber: 1,
          exist: true,
          products: [
            {
              id: 'abc12345-e89b-12d3-a456-426614174000',
              name: 'Coca Cola',
              price: 2.5,
              description: 'Regular Coca Cola',
              image_url: 'https://example.com/coca-cola.jpg',
              exist: true,
            },
          ],
          restaurant: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Test Cafe',
            slug: 'test-cafe',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category or restaurant not found',
      schema: {
        example: {
          message: 'Category with ID c2917676-d3d2-472a-8b7c-785f455a80ab not found in restaurant test-cafe',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

export function UpdateCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update category',
      description: 'Updates a specific category information. You can update the name and/or sequence number.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
    }),
    ApiBody({
      type: UpdateCategoryDto,
      description: 'Category data to update',
      examples: {
        fullUpdate: {
          summary: 'Update both name and sequence',
          value: {
            name: 'Hot Beverages',
            sequenceNumber: 2,
          },
        },
        nameOnly: {
          summary: 'Update only the name',
          value: {
            name: 'Hot Beverages',
          },
        },
        sequenceOnly: {
          summary: 'Update only the sequence number',
          value: {
            sequenceNumber: 2,
          },
        },
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Category updated successfully',
      schema: {
        example: {
          id: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
          name: 'Hot Beverages',
          created_at: '2024-03-20T15:30:00.000Z',
          updated_at: '2024-03-20T15:35:00.000Z',
          sequenceNumber: 2,
          exist: true,
          products: [
            {
              id: 'abc12345-e89b-12d3-a456-426614174000',
              name: 'Coca Cola',
              price: 2.5,
              description: 'Regular Coca Cola',
              image_url: 'https://example.com/coca-cola.jpg',
              exist: true,
            },
          ],
          restaurant: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Test Cafe',
            slug: 'test-cafe',
          },
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category or restaurant not found',
      schema: {
        example: {
          message: 'Category with ID c2917676-d3d2-472a-8b7c-785f455a80ab not found in restaurant test-cafe',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

export function DeleteCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete category',
      description: 'Deletes a specific category and its associated products from the restaurant menu.',
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiParam({
      name: 'id',
      description: 'Category ID',
      example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
    }),
    ApiResponse({
      status: 200,
      description: 'Category deleted successfully',
      schema: {
        example: {
          message: 'Category Hot Beverages has been deleted successfully',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Category or restaurant not found',
      schema: {
        example: {
          message: 'Category with ID c2917676-d3d2-472a-8b7c-785f455a80ab not found in restaurant test-cafe',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

export function UpdateCategorySequenceDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update categories sequence',
      description: 'Updates the display order of multiple categories at once. Useful for drag and drop reordering.'
    }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiBody({
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'c2917676-d3d2-472a-8b7c-785f455a80ab' },
            sequenceNumber: { type: 'number', example: 1 },
          },
        },
      },
      examples: {
        reorderCategories: {
          summary: 'Reorder Hot Beverages and Cold Beverages categories',
          value: [
            { id: 'c2917676-d3d2-472a-8b7c-785f455a80ab', sequenceNumber: 1 },
            { id: '7d1e3cd8-2a0d-4a40-8b2e-4e1c9578c8f3', sequenceNumber: 2 },
          ],
        },
      },
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Categories reordered successfully',
      schema: {
        example: {
          message: 'Category sequences have been updated successfully'
        }
      }
    }),
    ApiResponse({ 
      status: 400, 
      description: 'Sequence update failed',
      schema: {
        example: {
          message: 'Failed to update category sequences. Please ensure all category IDs are valid and try again.',
          error: 'Sequence Update Failed',
          statusCode: 400
        }
      }
    }),
    ApiResponse({ 
      status: 401, 
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized user',
          error: 'Unauthorized',
          statusCode: 401
        }
      }
    }),
    ApiResponse({ 
      status: 404, 
      description: 'Restaurant or categories not found',
      schema: {
        example: {
          message: 'One or more categories not found in restaurant test-cafe',
          error: 'Not Found',
          statusCode: 404
        }
      }
    }),
  );
}
