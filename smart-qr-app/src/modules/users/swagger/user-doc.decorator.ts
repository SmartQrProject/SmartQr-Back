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
      example: '95f1894e-b071-46ea-9bf2-ca41a6e1ad53',
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
              id: '95f1894e-b071-46ea-9bf2-ca41a6e1ad53',
              email: 'smartqr2@gmail.com',
              name: 'owner Test Cafe',
              role: 'owner',
              is_active: true,
              created_at: '2024-03-20T12:34:56.789Z',
              restaurant: {
                id: '531a7844-b425-4f90-b161-a78ce748f977',
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
              id: '95f1894e-b071-46ea-9bf2-ca41a6e1ad53',
              email: 'smartqr2@gmail.com',
              name: 'owner Test Cafe',
              role: 'owner',
              created_at: '2024-03-20T12:34:56.789Z',
              is_active: 'owner',
              restaurant: {
                id: '531a7844-b425-4f90-b161-a78ce748f977',
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
      example: 'eli-cafe',
      required: true,
    }),
    ApiParam({
      name: 'id',
      description: 'User ID',
      example: '3788d5db-d28b-4898-a82b-294eb397970b',
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

        elicafeOwner: {
          value: {
            email: 'testsmartqr@gmail.com',
            password: 'Clave123$$',
          },
          summary: 'Eli Cafe Owner credentials',
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
            id: '3788d5db-d28b-4898-a82b-294eb397970b',
            email: 'testsmartqr@gmail.com',
            name: 'owner Eli Cafe',
            role: 'owner',
            created_at: '2024-03-20T12:34:56.789Z',
            restaurant: {
              id: '531a7844-b425-4f90-b161-a78ce748f977',
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

export function CheckEmailDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Verify if an email already exists' }),
    ApiQuery({
      name: 'email',
      description: 'Email to verify',
      example: 'owner@example.com',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Returns whether the email exists',
      schema: {
        example: { exists: true },
      },
    }),
  );
}
