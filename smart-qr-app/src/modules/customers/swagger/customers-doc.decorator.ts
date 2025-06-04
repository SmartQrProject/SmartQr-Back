import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CompletoCustomerDto } from '../dto/completo-customer.dto';
import { CustomerResponseDto } from '../dto/customer-response.dto';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { LogInCustomerDto } from '../dto/login-customer.dto';
import { Auth0CustomerDto } from '../dto/auth0-customer.dto';

export function CustomerSlugParam() {
  return ApiParam({
    name: 'slug',
    description: 'Unique identifier of the restaurant',
    example: 'eli-cafe',
    required: true,
  });
}

export function CustomerIdParam() {
  return ApiParam({
    name: 'id',
    description: 'Unique identifier for the Customer',
    example: 'xxxxx',
    required: true,
  });
}

export function SyncAuth0Doc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Create or Update data coming from Auth0',
      description: 'Synchronizes or creates a customer based on Auth0 authentication data'
    }),
    ApiBody({ type: Auth0CustomerDto }),
    ApiResponse({ 
      status: 200, 
      description: 'Customer synchronized successfully',
      type: CustomerResponseDto 
    }),
    ApiResponse({ status: 400, description: 'Invalid Auth0 data' }),
    CustomerSlugParam()
  );
}

export function CreateCustomerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new customer account' }),
    ApiBody({ type: CreateCustomerDto }),
    ApiResponse({ 
      status: 201, 
      description: 'Customer created successfully',
      type: CustomerResponseDto 
    }),
    ApiResponse({ status: 400, description: 'Invalid customer data' }),
    ApiResponse({ status: 409, description: 'Email already exists' }),
    CustomerSlugParam()
  );
}

export function SignInCustomerDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Customer Login (email and password)' }),
    ApiBody({ type: LogInCustomerDto }),
    ApiResponse({ 
      status: 200, 
      description: 'Login successful',
      schema: {
        properties: {
          access_token: { type: 'string' },
          customer: { $ref: '#/components/schemas/CustomerResponseDto' }
        }
      }
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
    CustomerSlugParam()
  );
}

export function GetAllCustomersDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Get paginated list of customers',
      description: 'Returns a paginated list of customers with their basic information, excluding passwords'
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Items per page (default: 5)',
      example: 5
    }),
    ApiResponse({ 
      status: 200, 
      description: 'List of customers retrieved successfully',
      schema: {
        properties: {
          page: { type: 'number', example: 1 },
          limit: { type: 'number', example: 5 },
          customers: { 
            type: 'array',
            items: { 
              type: 'object',
              properties: {
                id: { type: 'string' },
                auth0Id: { type: 'string', nullable: true },
                email: { type: 'string' },
                name: { type: 'string', nullable: true },
                picture: { type: 'string', nullable: true },
                phone: { type: 'string', nullable: true },
                reward: { type: 'number' },
                last_visit: { type: 'string', format: 'date-time', nullable: true },
                visits_count: { type: 'number' },
                created_at: { type: 'string', format: 'date-time' },
                modified_at: { type: 'string', format: 'date-time' },
                exist: { type: 'boolean' },
                isActive: { type: 'boolean' }
              }
            }
          }
        }
      }
    }),
    ApiResponse({ status: 404, description: 'No customers found' }),
    CustomerSlugParam()
  );
}

export function GetCustomerByIdDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Get customer details by ID',
      description: 'Retrieves detailed customer information including order history'
    }),
    ApiResponse({ 
      status: 200, 
      description: 'Customer found',
      type: CustomerResponseDto
    }),
    ApiResponse({ status: 404, description: 'Customer not found' }),
    CustomerSlugParam(),
    CustomerIdParam()
  );
}

export function UpdateCustomerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ 
      summary: 'Update customer data',
      description: 'Updates customer information, returns customer data without password'
    }),
    ApiBody({ type: UpdateCustomerDto }),
    ApiResponse({ 
      status: 200, 
      description: 'Customer updated successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          auth0Id: { type: 'string', nullable: true },
          email: { type: 'string' },
          name: { type: 'string', nullable: true },
          picture: { type: 'string', nullable: true },
          phone: { type: 'string', nullable: true },
          reward: { type: 'number' },
          last_visit: { type: 'string', format: 'date-time', nullable: true },
          visits_count: { type: 'number' },
          created_at: { type: 'string', format: 'date-time' },
          modified_at: { type: 'string', format: 'date-time' },
          exist: { type: 'boolean' },
          isActive: { type: 'boolean' }
        }
      }
    }),
    ApiResponse({ status: 400, description: 'Invalid update data' }),
    ApiResponse({ status: 404, description: 'Customer not found' }),
    CustomerSlugParam(),
    CustomerIdParam()
  );
}

export function DeleteCustomerDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a customer (soft delete)' }),
    ApiResponse({ 
      status: 200, 
      description: 'Customer deleted successfully' 
    }),
    ApiResponse({ status: 404, description: 'Customer not found' }),
    CustomerSlugParam(),
    CustomerIdParam()
  );
}
