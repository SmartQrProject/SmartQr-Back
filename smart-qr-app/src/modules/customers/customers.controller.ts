import {
  Controller,
  UseGuards,
  Get,
  Req,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { JwtAuth0Guard } from 'src/common/guards/jwt-auth0.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Auth0Dto } from './dto/auth0.dto';

@ApiTags('CRUD end points para Customers. SignUP, SignIn using Auth0 ')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get('protected')
  @UseGuards(JwtAuth0Guard)
  async getProtected(@Request() req) {
    console.log('Acceso Autorizado!!!', req.user, req.auth);
    return {
      message: 'Acceso Autorizado!!!',
      user: req.user,
    };
  }

  @Get('login')
  @UseGuards(JwtAuth0Guard)
  async getAuth0Login(@Req() req) {
    console.log('Access Token: ---------- >');
    console.log(req.oidc.accessToken);
    // console.log('oidc.USer: ---------- >');
    // console.log(JSON.stringify(req.oidc.user));
    return JSON.stringify(req.oidc.user);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @Post('register')
  create(@Body() createCustomerDto: RegisterDto) {
    return this.customersService.register(
      createCustomerDto.email,
      createCustomerDto.password,
    );
  }

  @Post('login1')
  login(@Body() dto: LoginDto) {
    return this.customersService.login(dto.email, dto.password);
  }

  @Post('auth0')
  loginWithAuth0(@Body() dto: Auth0Dto) {
    return this.customersService.loginWithAuth0(dto.auth0Id);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customersService.remove(+id);
  }
}
