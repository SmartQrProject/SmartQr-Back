import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  HttpCode,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
  Delete,
  ParseUUIDPipe,
  Param,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/shared/entities/user.entity';
import { PutUserDto } from './dto/put-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';
//import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags(
  'App Users creation (SignUP) and user login (SignIn) using JWT and Bcrypt',
)
@Controller('users')
export class UsersController {
  authUsersService;
  constructor(private readonly authService: UsersService) {}

  // GEA Mayo-13-Finalizado ------ trabajando en este endpoint --------GEA Mayo-12
  @Put(':id')
  @HttpCode(200)
  //@UseGuards(AuthGuard)
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Modify users data' })
  modifyUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('slug') slug: string,
    @Body() user: PutUserDto,
    @Req() req: Request,
  ): Promise<string> {
    return this.authService.modifyUserById(id, slug, user, req);
  }

  // GEA Mayo-13-Finalizado ------ trabajando en este endpoint --------GEA Mayo-12
  @Post('signup')
  @HttpCode(201)
  @ApiOperation({ summary: 'Users App creation' })
  async userSignUp(
    @Param('slug') slug: string,
    @Body() user: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    console.log(slug, user);
    return this.authService.userSignUp(slug, user);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Get()
  @HttpCode(200)
  //@UseGuards(AuthGuard)
  //@ApiBearerAuth()
  @ApiOperation({
    summary: 'Get paginated users list',
    description:
      'Retrieves a paginated list of users for a specific restaurant. Requires authentication.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    example: 1,
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Items per page',
    example: 5,
    required: false,
    type: Number,
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    schema: {
      example: {
        message: 'Unauthorized user',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant not found',
    schema: {
      example: {
        message: 'Restaurant with slug test-cafe not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  getUsers(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    console.log('slug', slug);
    return this.authService.getUsers(slug, page, limit);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Delete(':id')
  @HttpCode(200)
  //@UseGuards(AuthGuard)
  //@ApiBearerAuth()
  @ApiOperation({ summary: 'Deletion of User' })
  deleteUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('slug') slug: string,
    @Req() req: Request,
  ): Promise<string> {
    return this.authService.deleteUserById(id, slug, req);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Post('signin')
  @HttpCode(201)
  @ApiOperation({
    summary: 'User login',
    description:
      'Allows a user to sign in using their email and password. Returns a JWT token for authentication.',
  })
  @ApiBody({
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
    },
  })
  @ApiResponse({
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
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    schema: {
      example: {
        message: 'Invalid email or password',
        error: 'Unauthorized',
        statusCode: 401,
      },
    },
  })
  async userLogin(@Body() auth: SignInUserDto): Promise<object> {
    return this.authService.userLogin(auth);
  }
}
