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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthCustomersService } from './authCustomers.service';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';

@ApiTags('Customer creation (SignUP) and user login (SignIn) using Auth0')
@Controller('auth/customers')
export class AuthCustomersController {
  constructor(private readonly customersService: AuthCustomersService) {}

  @Get('login')
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
