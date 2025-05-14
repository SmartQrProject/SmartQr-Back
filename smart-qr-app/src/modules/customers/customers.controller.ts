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
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { JwtAuth0Guard } from 'src/common/guards/jwt-auth0.guard';
import { Auth0CustomerDto } from './dto/auth0-customer.dto';
import { Customer } from 'src/shared/entities/customer.entity';

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

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Post('sincronizar')
  @ApiOperation({ summary: 'Create or Update data coming from Auth0' })
  //@UseGuards(JwtAuthGuard)
  async sincronizarAuth0(
    @Body() customer: Auth0CustomerDto,
    @Req() req,
  ): Promise<Customer> {
    return this.customersService.sincronizarAuth0(customer);
  }

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
