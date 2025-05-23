import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

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
    example: '52cbd705-2edd-4809-947a-72951a93ae82',
    required: true,
  });
}

export function SyncAuth0Doc() {
  return applyDecorators(ApiOperation({ summary: 'Create or Update data coming from Auth0' }), CustomerSlugParam());
}

export function CreateCustomerDoc() {
  return CustomerSlugParam();
}

export function SignInCustomerDoc() {
  return applyDecorators(ApiOperation({ summary: 'Customer Login (email and password)' }), CustomerSlugParam());
}

export function GetAllCustomersDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Paginated report with Customer created in the DB' }),
    ApiResponse({ status: 404, description: 'No customers defined in the database' }),
    CustomerSlugParam(),
  );
}

export function GetCustomerByIdDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Get data from one Customer by his ID and retrieve the Orders history of this customer' }),
    ApiResponse({ status: 404, description: 'No Customers defined in the database' }),
    CustomerSlugParam(),
    CustomerIdParam(),
  );
}

export function UpdateCustomerDoc() {
  return applyDecorators(ApiOperation({ summary: 'Modify Customers data' }), CustomerSlugParam());
}

export function DeleteCustomerDoc() {
  return CustomerSlugParam();
}
