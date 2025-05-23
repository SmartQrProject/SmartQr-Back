import { Controller, UseGuards, Get, Req, Post, Body, Patch, Param, Delete, HttpCode, Query, DefaultValuePipe, ParseIntPipe, Put, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { Customer } from 'src/shared/entities/customer.entity';
import { Auth0CustomerDto } from './dto/auth0-customer.dto';
import { LogInCustomerDto } from './dto/login-customer.dto';
import {
  CreateCustomerDoc,
  DeleteCustomerDoc,
  GetAllCustomersDoc,
  GetCustomerByIdDoc,
  SignInCustomerDoc,
  SyncAuth0Doc,
  UpdateCustomerDoc,
} from './swagger/customers-doc.decorator';
import { Request } from 'express';

@ApiTags('CRUD EndPoints para Customers (restaurant customers). SignUP, SignIn, etc')
@Controller(':slug/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post('sincronizar')
  //@UseGuards(JwtAuthGuard)
  @SyncAuth0Doc()
  async sincronizarAuth0(@Body() customer: Auth0CustomerDto, @Param('slug') slug: string, @Req() req: Request): Promise<Customer> {
    console.log('customer', req);
    return this.customersService.sincronizarAuth0(customer, slug);
  }

  // listo 14-Mayo GEA
  @Post('signup')
  @CreateCustomerDoc()
  async create(@Body() createCustomerDto: CreateCustomerDto, @Param('slug') slug: string) {
    return this.customersService.create(createCustomerDto, slug);
  }

  // listo 14-Mayo GEA
  @Get()
  @HttpCode(200)
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @GetAllCustomersDoc()
  async getAllCustomers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
    @Param('slug') slug: string,
  ) {
    return this.customersService.getAllCustomers(page, limit);
  }

  // listo 14-Mayo GEA
  @Get(':id')
  @HttpCode(200)
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @GetCustomerByIdDoc()
  async findById(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  // listo 14-Mayo GEA
  @Put(':id')
  @HttpCode(200)
  //@ApiBearerAuth()
  @UpdateCustomerDoc()
  async modifyCustomersById(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() customer: UpdateCustomerDto,
    @Req() req: Request,
  ): Promise<Omit<Customer, 'password'>> {
    return this.customersService.updateById(id, customer, req);
  }

  // listo 14-Mayo GEA
  @Delete(':id')
  @DeleteCustomerDoc()
  async remove(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Req() req: Request): Promise<string> {
    return this.customersService.removeById(id, req);
  }

  //  FINALIZADO GEA MAyo-14
  @Post('signin')
  @HttpCode(201)
  @SignInCustomerDoc()
  async customerLogin(@Param('slug') slug: string, @Body() customer: LogInCustomerDto): Promise<object> {
    return this.customersService.customerLogin(customer);
  }

  // @Patch(':id')
  // @ApiBearerAuth()
  // @ApiOperation({ summary: 'Update Customers data by Id' })
  // update(
  //   @Param('id', ParseUUIDPipe) id: string,
  //   @Body() updateCustomerDto: UpdateCustomerDto,
  //   @Req() req: Request,
  // ) {
  //   return this.customersService.update(id, updateCustomerDto, req);
  // }
}
