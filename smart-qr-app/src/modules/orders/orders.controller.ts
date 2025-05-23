import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Put, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { CreateOrderDoc, GetAllOrdersDoc, GetOrderByIdDoc, UpdateOrderDoc, DeleteOrderDoc } from './swagger/orders.decorator';

@ApiBearerAuth()
@Controller(':slug/orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @CreateOrderDoc()
  async create(@Param('slug') slug: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto, slug);
  }

  @Get()
  @GetAllOrdersDoc()
  async findAll(@Param('slug') slug: string) {
    return this.ordersService.findAll(slug);
  }

  @Get(':id')
  @GetOrderByIdDoc()
  async findOne(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @UpdateOrderDoc()
  async update(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @DeleteOrderDoc()
  async remove(@Param('slug') slug: string, @Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.remove(id);
  }
}
