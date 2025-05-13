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
} from '@nestjs/swagger';
import { AuthUsersService } from './authUsers.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from 'src/shared/entities/user.entity';
import { PutUserDto } from '../users/dto/put-user.dto';
import { SignInUserDto } from '../users/dto/signIn-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags(
  'App Users creation (SignUP) and user login (SignIn) using JWT and Bcrypt',
)
@Controller('auth/users')
export class AuthUsersController {
  authUsersService;
  constructor(private readonly authService: AuthUsersService) {}

  // GEA Mayo-13-Finalizado ------ trabajando en este endpoint --------GEA Mayo-12
  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
    @Query('slug') slug: string,
    @Body() user: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    console.log(slug, user);
    return this.authService.userSignUp(slug, user);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Get('')
  @HttpCode(200)
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Paginated report with Users created in the DB' })
  @ApiResponse({ status: 404, description: 'No users defined in the database' })
  getUsers(
    @Query('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.authService.getUsers(slug, page, limit);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
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
  @ApiOperation({ summary: 'User Login (email and  password)' })
  async userLogin(
    @Query('slug') slug: string,
    @Body() auth: SignInUserDto,
  ): Promise<object> {
    return this.authService.userLogin(slug, auth);
  }
}
