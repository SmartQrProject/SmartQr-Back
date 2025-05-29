import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiBody, ApiParam } from '@nestjs/swagger';
import { SignInUserDto } from '../dto/signIn-user.dto';
import { PutUserDto } from '../dto/put-user.dto';

const SlugParam = ApiParam({
  name: 'slug',
  description: 'Unique restaurant identifier',
  example: 'test-cafe',
  required: true,
});

const IdParam = ApiParam({
  name: 'id',
  description: 'User ID',
  example: '20966491-1959-40ce-96f9-5c391d79fb1f',
  required: true,
});

const PageQuery = ApiQuery({ name: 'page', description: 'Page number', example: 1, required: false, type: Number });
const LimitQuery = ApiQuery({ name: 'limit', description: 'Items per page', example: 5, required: false, type: Number });
const ApiUnauthorized = ApiResponse({
  status: 401,
  description: 'Unauthorized',
  schema: {
    example: { message: 'Unauthorized user', error: 'Unauthorized', statusCode: 401 },
  },
});
const ApiNotFound = ApiResponse({
  status: 404,
  description: 'Restaurant not found',
  schema: {
    example: { message: 'Restaurant with slug test-cafe not found', error: 'Not Found', statusCode: 404 },
  },
});

export function ModifyUserByIdDoc() {
  return applyDecorators(ApiBearerAuth(), ApiOperation({ summary: 'Modify users data' }), SlugParam, IdParam, ApiBody({ type: PutUserDto }));
}

export function CreateUserDoc() {
  return applyDecorators(ApiOperation({ summary: 'Users App creation' }), SlugParam);
}

export function GetAllUsersDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get paginated users list',
      description: 'Retrieves a paginated list of users for a specific restaurant. Requires authentication.',
    }),
    ApiQuery({ name: 'slug', description: 'Unique restaurant identifier', example: 'test-cafe', required: true }),
    PageQuery,
    LimitQuery,
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
    ApiUnauthorized,
    ApiNotFound,
  );
}

export function GetActiveStaff() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({
      summary: 'Get paginated staff only active users list for an specific restaurant',
      description: 'Retrieves a paginated staff active users list of users for a specific restaurant. Requires authentication.',
    }),
    ApiQuery({ name: 'slug', description: 'Unique restaurant identifier', example: 'test-cafe', required: true }),
    PageQuery,
    LimitQuery,
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
    ApiUnauthorized,
    ApiNotFound,
  );
}

export function DeleteUserByIdDoc() {
  return applyDecorators(ApiBearerAuth(), ApiOperation({ summary: 'De-activation of a user record' }), SlugParam, IdParam);
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
          value: { email: 'smartqr2@gmail.com', password: '!Example123' },
          summary: 'Test Cafe owner credentials',
        },
        testCafeStaff: {
          value: { email: 'amigop@gmail.com', password: 'Clave123$$' },
          summary: 'Test Cafe staff credentials',
        },
        testSuperAdmin: {
          value: { email: 'info@smart-qr.tech', password: 'HardPass123%%' },
          summary: 'SUPERADMIN',
        },
        testAmigoRestoOwner: {
          value: { email: 'amigogabrielernesto@yahoo.com', password: 'Clave123%%' },
          summary: 'AmigoResto Owner credentials',
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
      description: 'Invalid credentials',
      schema: {
        example: { message: 'Invalid email or password', error: 'Unauthorized', statusCode: 401 },
      },
    }),
  );
}
