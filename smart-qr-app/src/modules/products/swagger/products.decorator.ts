import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

// 🔁 Reutilizables

const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'test-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'Unique product identifier',
  example: '97ed9278-5451-4363-8bbc-c4280bfd0f02',
  required: true,
});

const PaginationQueries = applyDecorators(
  ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  }),
  ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  }),
);

const Unauthorized = ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: {
      statusCode: 401,
      message: 'Unauthorized',
      error: 'Unauthorized',
    },
  },
});

const NotFound = (desc = 'Resource not found') =>
  ApiResponse({
    status: 404,
    description: desc,
    schema: {
      example: {
        statusCode: 404,
        message: desc,
        error: 'Not Found',
      },
    },
  });

const BadRequest = ApiResponse({
  status: 400,
  description: 'Invalid data provided',
  schema: {
    example: {
      statusCode: 400,
      message: ['Some fields are invalid or missing'],
      error: 'Bad Request',
    },
  },
});

const Conflict = ApiResponse({
  status: 409,
  description: 'Product name already exists in restaurant',
  schema: {
    example: {
      statusCode: 409,
      message: 'A product with this name already exists in this restaurant',
      error: 'Conflict',
    },
  },
});

// ✅ Decoradores

export function CreateProductDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({
      summary: 'Create a new product',
      description: 'Creates a new product in a specific category for the restaurant menu.',
    }),
    ApiBody({
      type: CreateProductDto,
      description: 'Creates a product with the required info including image URL and category',
      examples: {
        beverage: {
          summary: 'Create a beverage product',
          value: {
            name: 'Coca Cola',
            price: 2.5,
            description: 'Regular Coca Cola 355ml',
            image_url: 'https://example.com/coca-cola.jpg',
            categoryId: 'd8737e33-4d0d-49eb-ad10-b2a1d3489666',
            is_available: true,
            sequenceNumber: 10,
            details: ['gluten-free', 'vegan'],
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Product created successfully' }),
    BadRequest,
    Unauthorized,
    NotFound('Restaurant or category not found'),
    Conflict,
  );
}

export function GetAllProductsDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({
      summary: 'Get all products for the restaurant',
      description: 'Retrieves all products for a specific restaurant, paginated and ordered.',
    }),
    PaginationQueries,
    ApiResponse({ status: 200, description: 'List of all products retrieved' }),
    Unauthorized,
    NotFound('Restaurant not found'),
  );
}

export function GetProductByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Get a product by ID',
      description: 'Retrieves a specific product from a restaurant using its ID.',
    }),
    ApiResponse({ status: 200, description: 'Product retrieved successfully' }),
    Unauthorized,
    NotFound('Product not found'),
  );
}

export function UpdateProductDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Update a product' }),
    ApiBody({
      type: UpdateProductDto,
      description: 'Fields required to update an existing product',
    }),
    ApiResponse({ status: 200, description: 'Product updated successfully' }),
    BadRequest,
    Unauthorized,
    NotFound('Product not found'),
    Conflict,
  );
}

export function DeleteProductDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({ summary: 'Delete a product' }),
    ApiResponse({
      status: 200,
      description: 'Product deleted successfully',
      schema: {
        example: {
          message: 'Product deleted successfully',
        },
      },
    }),
    Unauthorized,
    NotFound('Product not found'),
  );
}

export function UpdateProductSequencesDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({ summary: 'Update product order/sequence' }),
    ApiBody({
      description: 'List of products with new sequence numbers',
      schema: {
        example: [
          { id: '97ed9278-5451-4363-8bbc-c4280bfd0f02', sequenceNumber: 1 },
          { id: 'fa781c32-86e5-4c11-874e-71f21c0f2e29', sequenceNumber: 2 },
        ],
      },
    }),
    ApiResponse({ status: 200, description: 'Product sequences updated successfully' }),
    BadRequest,
    Unauthorized,
    NotFound('Restaurant or product not found'),
  );
}
