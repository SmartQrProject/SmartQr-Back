import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { SignInUserDto } from '../dto/signIn-user.dto';
import { PutUserDto } from '../dto/put-user.dto';

export function ModifyUserByIdDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Modify users data. Sends email to the restaurant owner' }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
      required: true,
    }),
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: 'XXXXX491-1959-40ce-96f9-5c391d79fb1f',
      required: true,
    }),
    ApiBody({ type: PutUserDto }),
    ApiResponse({ status: 404, description: '❌ No users found  with id or is blocked !!' }),
    ApiResponse({ status: 404, description: '❌ restaurant ${slug} found !!' }),
    ApiResponse({ status: 404, description: '❌ Email already in use: ${user.email} !!' }),
    ApiResponse({ status: 409, description: 'Passwords are not equals!!!' }),
  );
}

export function CreateUserDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Users App creation. Sends an email to restaurant owner' }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
      required: true,
    }),
    ApiResponse({ status: 409, description: '❌ Passwords are not equals!!!' }),
    ApiResponse({ status: 409, description: '❌ User ${newUser.email} already exists!!' }),
  );
}
//
export function GetAllUsersDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get paginated users list',
      description: 'Retrieves a paginated list of users for a specific restaurant. Requires authentication.',
    }),
    ApiQuery({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'eli-cafe',
      required: true,
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number',
      example: 1,
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Items per page',
      example: 5,
      required: false,
      type: Number,
    }),
    ApiResponse({
      status: 200,
      description: 'Users found successfully',
      schema: {
        example: {
          users: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'smartqr2@gmail.com',
              name: 'owner Test Cafe',
              role: 'owner',
              is_active: true,
              created_at: '2024-03-20T12:34:56.789Z',
              restaurant: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Eli Cafe',
                slug: 'eli-cafe',
              },
            },
          ],
          total: 1,
          page: 1,
          limit: 5,
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
          message: 'Restaurant with slug eli-cafe not found',
          error: 'Not Found',
          statusCode: 404,
        },
      },
    }),
  );
}

//
export function GetActiveStaff() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get paginated staff only active users list for an specific restaurant',
      description: 'Retrieves a paginated staff active users list of users for a specific restaurant. Requires authentication.',
    }),
    ApiQuery({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiQuery({
      name: 'page',
      description: 'Page number',
      example: 1,
      required: false,
      type: Number,
    }),
    ApiQuery({
      name: 'limit',
      description: 'Items per page',
      example: 5,
      required: false,
      type: Number,
    }),
    ApiResponse({
      status: 200,
      description: 'Users found successfully',
      schema: {
        example: {
          users: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'smartqr2@gmail.com',
              name: 'owner Test Cafe',
              role: 'owner',
              created_at: '2024-03-20T12:34:56.789Z',
              is_active: 'owner',
              restaurant: {
                id: '550e8400-e29b-41d4-a716-446655440000',
                name: 'Test Cafe',
                slug: 'test-cafe',
              },
            },
          ],
          total: 1,
          page: 1,
          limit: 5,
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

//
export function DeleteUserByIdDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'De-activation of a user record' }),
    ApiParam({
      name: 'slug',
      description: 'Unique restaurant identifier',
      example: 'test-cafe',
      required: true,
    }),
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: '20966491-1959-40ce-96f9-5c391d79fb1f',
      required: true,
    }),
    ApiResponse({ status: 404, description: '❌ No users found  with id or is blocked !!' }),
    ApiResponse({ status: 404, description: '❌ restaurant ${slug} found !!' }),
  );
}

export function UserLoginDoc() {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description: 'Allows a user to sign in using their email and password. Returns a JWT token for authentication.',
    }),
    ApiBody({
      type: SignInUserDto,
      description: 'User credentials',
      examples: {
        testCafeOwner: {
          value: {
            email: 'smartqr2@gmail.com',
            password: '!Example123',
          },
          summary: 'Test Cafe owner credentials',
        },

        testCafeStaff: {
          value: {
            email: 'amigop@gmail.com',
            password: 'Clave123$$',
          },
          summary: 'Test Cafe staff credentials',
        },

        testSuperAdmin: {
          value: {
            email: 'info@smart-qr.tech',
            password: 'HardPass123%%',
          },
          summary: 'SUPERADMIN',
        },
        SuperAdminNuevo: {
          value: {
            email: 'amigoee@gmail.com',
            password: 'Clave123%%',
          },
          summary: 'SUPERADMIN Nuevo',
        },
        testAmigoRestoOwner: {
          value: {
            email: 'amigogabrielernesto@gmail.com',
            password: 'Clave123%%',
          },
          summary: 'Riviera Owner credentials',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Login successful',
      schema: {
        example: {
          user: {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'smartqr2@gmail.com',
            name: 'owner Test Cafe',
            role: 'owner',
            created_at: '2024-03-20T12:34:56.789Z',
            restaurant: {
              id: '550e8400-e29b-41d4-a716-446655440000',
              name: 'Test Cafe',
              slug: 'test-cafe',
            },
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'Not valid Credentials',
      schema: {
        example: {
          message: 'Invalid email or password',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
  );
}
