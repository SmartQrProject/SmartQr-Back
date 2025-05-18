import { Controller, UseGuards, Get, Req, Post, HttpCode, Query, Body, DefaultValuePipe, ParseIntPipe, Delete, ParseUUIDPipe, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/shared/entities/user.entity';
import { PutUserDto } from './dto/put-user.dto';
import { SignInUserDto } from './dto/signIn-user.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ModifyUserByIdDoc, UserSignUpDoc, GetUsersDoc, DeleteUserByIdDoc, UserLoginDoc } from './swagger/user-doc.decorator';

@ApiTags('App Users creation (SignUP) and user login (SignIn) using JWT and Bcrypt')
@Controller('users')
export class UsersController {
  authUsersService;
  constructor(private readonly authService: UsersService) {}

  // GEA Mayo-13-Finalizado ------ trabajando en este endpoint --------GEA Mayo-12
  @Put(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @ModifyUserByIdDoc()
  async modifyUserById(@Param('id', ParseUUIDPipe) id: string, @Query('slug') slug: string, @Body() user: PutUserDto, @Req() req: Request): Promise<string> {
    return this.authService.modifyUserById(id, slug, user, req);
  }

  // GEA Mayo-13-Finalizado ------ trabajando en este endpoint --------GEA Mayo-12
  @Post('signup')
  @HttpCode(201)
  @UserSignUpDoc()
  async userSignUp(@Param('slug') slug: string, @Body() user: CreateUserDto): Promise<Omit<User, 'password'>> {
    console.log(slug, user);
    return this.authService.userSignUp(slug, user);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Get()
  @HttpCode(200)
  //@UseGuards(AuthGuard)
  @GetUsersDoc() //////////////////////////////////////////////////////////////////necesita slug mandamos como query dado q no tenemos otra option
  async getUsers(
    @Query('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    console.log('slug', slug);
    return this.authService.getUsers(slug, page, limit);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Delete(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  @DeleteUserByIdDoc() //////////////////////////////////////////////////////////////////no necesita slug modifica por id
  async deleteUserById(@Param('id', ParseUUIDPipe) id: string, @Query('slug') slug: string, @Req() req: Request): Promise<string> {
    return this.authService.deleteUserById(id, slug, req);
  }

  //  FINALIZADO GEA MAyo-13------ trabajando en este endpoint --------GEA Mayo-13
  @Post('signin')
  @HttpCode(201)
  @UserLoginDoc() ////////////////////////////////////////////////////////////////////no necesita slug
  async userLogin(@Body() auth: SignInUserDto): Promise<object> {
    return this.authService.userLogin(auth);
  }
}
