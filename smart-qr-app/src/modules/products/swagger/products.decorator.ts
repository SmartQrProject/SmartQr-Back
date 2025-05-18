import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from '@nestjs/swagger';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

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

export function CreateProductDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({
      summary: 'Create a new product',
      description: 'Creates a new product in a specific category for the restaurant menu.',
    }),
    ApiBody({
      type: CreateProductDto,
      description: 'Crea un nuevo producto enviando los datos en JSON, incluyendo la URL de la imagen ya subida',
      examples: {
        beverage: {
          summary: 'Create a beverage product',
          value: {
            name: 'Coca Cola',
            price: 2.5,
            description: 'Regular Coca Cola 355ml',
            image_url: 'https://res.cloudinary.com/tu-cloud/image/upload/v1234567890/coca-cola.jpg',
            categoryId: 'd8737e33-4d0d-49eb-ad10-b2a1d3489666',
            is_available: true,
            sequenceNumber: 10,
          },
        },
      },
    }),
    ApiResponse({ status: 201, description: 'Product created successfully' }),
    ApiResponse({ status: 400, description: 'Invalid data provided' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Restaurant or category not found' }),
    ApiResponse({ status: 409, description: 'Product name already exists in restaurant' }),
  );
}

export function GetAllProductsDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({
      summary: 'Get all products for the restaurant',
      description: 'Retrieves all products for a specific restaurant using its slug. Products are returned paginated and ordered by their sequence number.',
    }),
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
    ApiResponse({ status: 200, description: 'List of all products retrieved' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Restaurant not found' }),
  );
}

export function GetProductByIdDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Get a product by ID',
      description: 'Retrieves a specific product from a restaurant using the restaurant slug and product ID',
    }),
    ApiResponse({ status: 200, description: 'Product found successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Product or restaurant not found' }),
  );
}

export function UpdateProductDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Update a product',
      description: 'Updates an existing product in the restaurant menu with the provided data',
    }),
    ApiBody({
      type: UpdateProductDto,
      examples: {
        product: {
          summary: "Example of updating a product's details",
          value: {
            name: 'Coca Cola Zero',
            price: 2.75,
            description: 'Sugar-free Coca Cola 355ml',
            image_url: 'https://example.com/images/coca-cola-zero.jpg',
            sequenceNumber: 2,
            categoryId: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
          },
        },
      },
    }),
    ApiResponse({ status: 200, description: 'Product updated successfully' }),
    ApiResponse({ status: 400, description: 'Invalid data provided' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Product or restaurant not found' }),
  );
}

export function DeleteProductDoc() {
  return applyDecorators(
    SlugParam,
    IdParam,
    ApiOperation({
      summary: 'Delete a product',
      description: 'Removes a product from the restaurant menu. This action cannot be undone.',
    }),
    ApiResponse({ status: 200, description: 'Product deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Product or restaurant not found' }),
  );
}

export function UpdateProductSequencesDoc() {
  return applyDecorators(
    SlugParam,
    ApiOperation({ summary: 'Update sequence numbers for multiple products' }),
    ApiBody({
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            sequenceNumber: { type: 'number', example: 1 },
          },
        },
      },
      examples: {
        products: {
          summary: 'Example of updating sequence numbers for multiple products',
          value: [
            { id: '123e4567-e89b-12d3-a456-426614174000', sequenceNumber: 1 },
            { id: '456abcde-f123-12d3-a456-426614174000', sequenceNumber: 2 },
          ],
        },
      },
    }),
    ApiResponse({ status: 200, description: 'The sequence numbers have been updated' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'One or more products not found' }),
  );
}
