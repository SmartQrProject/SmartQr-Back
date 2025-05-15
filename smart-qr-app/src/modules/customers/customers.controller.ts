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
  HttpCode,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { Customer } from 'src/shared/entities/customer.entity';
import { Auth0CustomerDto } from './dto/auth0-customer.dto';
import { LogInCustomerDto } from './dto/login-customer.dto';

@ApiTags('CRUD EndPoints para Customers. SignUP, SignIn, etc')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  // listo 14-Mayo GEA
  @Post('sincronizar')
  @ApiOperation({ summary: 'Create or Update data coming from Auth0' })
  //@UseGuards(JwtAuthGuard)
  async sincronizarAuth0(
    @Body() customer: Auth0CustomerDto,
    @Req() req,
  ): Promise<Customer> {
    return this.customersService.sincronizarAuth0(customer);
  }

  // listo 14-Mayo GEA
  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  // listo 14-Mayo GEA
  @Get('')
  @HttpCode(200)
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Paginated report with Customer created in the DB' })
  @ApiResponse({
    status: 404,
    description: 'No customers defined in the database',
  })
  getAllCustomers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.customersService.getAllCustomers(page, limit);
  }

  // listo 14-Mayo GEA
  @Get(':id')
  @HttpCode(200)
  // @Roles(Role.Admin)
  // @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get data from one Customer by ID' })
  @ApiResponse({
    status: 404,
    description: 'No Customers defined in the database',
  })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.customersService.findOne(id);
  }

  // listo 14-Mayo GEA
  @Put(':id')
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modify Customers data' })
  modifyCustomersById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() customer: UpdateCustomerDto,
    @Req() req: Request,
  ): Promise<Omit<Customer, 'password'>> {
    return this.customersService.updateById(id, customer, req);
  }

  // listo 14-Mayo GEA
  @Delete(':id')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<string> {
    return this.customersService.removeById(id, req);
  }

  //  FINALIZADO GEA MAyo-14
  @Post('signin')
  @HttpCode(201)
  @ApiOperation({ summary: 'Customer Login (email and  password)' })
  async customerLogin(@Body() customer: LogInCustomerDto): Promise<object> {
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
