import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiBody, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

// ✅ UTILIDADES COMUNES

export function SlugParamDoc(description = 'Unique restaurant identifier') {
  return ApiParam({
    name: 'slug',
    description,
    example: 'test-cafe',
    required: true,
  });
}

export function PaginationQueryDoc() {
  return applyDecorators(
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
  );
}

export function CommonErrorResponses() {
  return applyDecorators(
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

// ✅ DECORADORES ESPECÍFICOS

export function CreateCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Create a new category',
      description: 'Creates a new category for the restaurant menu. Requires owner authentication.',
    }),
    SlugParamDoc(),
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
      status: 409,
      description: 'Category name already exists',
      schema: {
        example: {
          message: 'A category with the name "Beverages" already exists in this restaurant',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    }),
    CommonErrorResponses(),
  );
}

export function GetAllCategoriesDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all categories for the restaurant',
      description: 'Retrieves a paginated list of categories with their products for a specific restaurant.',
    }),
    SlugParamDoc(),
    PaginationQueryDoc(),
    CommonErrorResponses(),
  );
}

export function GetCategoryByIdDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get a single category by ID',
      description: 'Retrieves a specific category from the restaurant by its ID.',
    }),
    SlugParamDoc(),
    ApiParam({
      name: 'categoryId',
      description: 'Unique identifier of the category',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    CommonErrorResponses(),
    ApiResponse({
      status: 200,
      description: 'Category found successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Category not found',
      schema: {
        example: {
          message: 'Category with id not found',
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
      summary: 'Update a category',
      description: 'Updates the name or order of a category. Requires owner authentication.',
    }),
    SlugParamDoc(),
    ApiParam({
      name: 'categoryId',
      description: 'Unique identifier of the category',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiBody({
      type: UpdateCategoryDto,
      description: 'Updated category data',
    }),
    ApiResponse({
      status: 200,
      description: 'Category successfully updated',
    }),
    ApiResponse({
      status: 409,
      description: 'Category name already exists',
      schema: {
        example: {
          message: 'A category with the name "Beverages" already exists in this restaurant',
          error: 'Conflict',
          statusCode: 409,
        },
      },
    }),
    CommonErrorResponses(),
  );
}

export function UpdateCategorySequenceDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Update category order',
      description: 'Updates the sequence/order of multiple categories.',
    }),
    SlugParamDoc(),
    ApiBody({
      description: 'List of categories with their new sequence numbers',
      schema: {
        example: [
          { id: '123e4567-e89b-12d3-a456-426614174000', sequenceNumber: 1 },
          { id: '223e4567-e89b-12d3-a456-426614174001', sequenceNumber: 2 },
        ],
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Category sequence updated successfully',
    }),
    CommonErrorResponses(),
  );
}

export function DeleteCategoryDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Delete a category',
      description: 'Deletes a category from the restaurant menu. Requires owner authentication.',
    }),
    SlugParamDoc(),
    ApiParam({
      name: 'categoryId',
      description: 'Unique identifier of the category to delete',
      example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    ApiResponse({
      status: 200,
      description: 'Category successfully deleted',
    }),
    CommonErrorResponses(),
  );
}
