import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateOrderDoc, GetAllOrdersDoc, GetOrderByIdDoc, UpdateOrderDoc, DeleteOrderDoc } from './swagger/orders.decorator';
import { JwtAuth0Guard } from 'src/common/guards/jwt-auth0.guard';
import { Roles } from 'src/common/decorators/roles.decorators';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from 'src/common/decorators/role.enum';

@ApiBearerAuth()
@Controller(':slug/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuth0Guard)
  @CreateOrderDoc()
  async create(@Param('slug') slug: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, slug);
  }

  @Get()
  @Roles(Role.Owner, Role.Staff)
  @UseGuards(AuthGuard, RolesGuard)
  @GetAllOrdersDoc()
  async findAll(@Param('slug') slug: string) {
    return this.ordersService.findAll(slug);
  }

  // @Get(':id')
  // @Roles(Role.Owner,Role.Staff)
  //  @UseGuards(AuthGuard, RolesGuard)
  // @GetOrderByIdDoc()
  // async findOne(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string) {
  //   return this.ordersService.findOne(id, slug);
  // }

  @Patch(':id')
  @Roles(Role.Owner, Role.Staff)
  @UseGuards(AuthGuard, RolesGuard)
  @UpdateOrderDoc()
  async update(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto, slug);
  }

  // @Delete(':id')
  // @Roles(Role.Owner,Role.Staff)
  //  @UseGuards(AuthGuard, RolesGuard)
  // @DeleteOrderDoc()
  // async remove(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string) {
  //   return this.ordersService.remove(id);
  // }
}
