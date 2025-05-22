import { Controller, UseGuards, Get, Req, Post, HttpCode, Query, Body, DefaultValuePipe, ParseIntPipe, Delete, ParseUUIDPipe, Param, Put, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/shared/entities/user.entity';
import { PutUserDto } from './dto/put-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateUserDoc, DeleteUserByIdDoc, GetAllUsersDoc, UserLoginDoc, ModifyUserByIdDoc, GetActiveStaff } from './swagger/user-doc.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { Role } from 'src/common/decorators/role.enum';

@ApiTags('App Users creation (SignUP) and user login (SignIn) using JWT and Bcrypt')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':slug/:id')
  @HttpCode(200)
  @ModifyUserByIdDoc()
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async modifyUserById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Body() user: Partial<PutUserDto>, @Req() req: Request): Promise<User> {
    return this.usersService.modifyUserById(id, slug, user, req);
  }

  @Get()
  @HttpCode(200)
  @GetAllUsersDoc() //////////////////////////////////////////////////////////////////necesita slug mandamos como query dado q no tenemos otra option
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getUsers(
    @Query('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    console.log('slug', slug);
    return this.usersService.getUsers(slug, page, limit);
  }

  @Get('staff')
  @HttpCode(200)
  @GetActiveStaff() //////////////////////////////////////////////////////////////////necesita slug mandamos como query dado q no tenemos otra option
  @Roles(Role.Owner, Role.SuperAdmin)
  @UseGuards(AuthGuard, RolesGuard)
  async getActiveStaff(
    @Query('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.usersService.getActiveStaff(slug, page, limit);
  }
  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Delete(':slug/:id')
  @HttpCode(200)
  @DeleteUserByIdDoc() //////////////////////////////////////////////////////////////////no necesita slug modifica por id
  @Roles(Role.Owner, Role.SuperAdmin, Role.Staff)
  @UseGuards(AuthGuard, RolesGuard)
  async deleteUserById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Req() req: Request): Promise<User> {
    return this.usersService.deleteUserById(id, slug, req);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Post('signin')
  @HttpCode(201)
  @UserLoginDoc() ////////////////////////////////////////////////////////////////////no necesita slug
  async userLogin(@Body() auth: SignInUserDto): Promise<object> {
    return this.usersService.userLogin(auth);
  }

  //  FINALIZADO GEA MAyo-18
  @Post(':slug/signup')
  @HttpCode(201)
  @CreateUserDoc()
  async userSignUp(@Param('slug') slug: string, @Body() user: CreateUserDto): Promise<Omit<User, 'password'>> {
    return this.usersService.userSignUp(slug, user);
  }
}
