import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiBearerAuth()
@Controller(':slug/orders')
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  create(@Param('slug') slug: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':slug')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  findAll(@Param('slug') slug: string) {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  async findOne(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  async update(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'slug',
    description: 'Unique restaurant identifier',
    example: 'test-cafe',
    required: true,
  })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    example: 'c2917676-d3d2-472a-8b7c-785f455a80ab',
  })
  async remove(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.ordersService.remove(id);
  }
}
