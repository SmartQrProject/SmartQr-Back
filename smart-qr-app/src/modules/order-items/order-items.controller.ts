import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import {
  CreateOrderItemDoc,
  GetAllOrderItemsDoc,
  GetOrderItemByIdDoc,
  UpdateOrderItemDoc,
  DeleteOrderItemDoc,
} from './swagger/order-item.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiBearerAuth()
@Controller(':slug/order-items')
@UseGuards(AuthGuard)
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @CreateOrderItemDoc()
  async create(
    @Param('slug') slug: string,
    @Body() createOrderItemDto: CreateOrderItemDto,
  ) {
    const orderItem = await this.orderItemsService.create(slug, createOrderItemDto);
    return {
      message: 'Item de orden creado exitosamente',
      orderItem,
    };
  }

  @Get()
  @GetAllOrderItemsDoc()
  async findAll(@Param('slug') slug: string) {
    return this.orderItemsService.findAll(slug);
  }

  @Get(':id')
  @GetOrderItemByIdDoc()
  async findOne(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.orderItemsService.findOne(slug, id);
  }

  @Put(':id')
  @UpdateOrderItemDoc()
  async update(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    const orderItem = await this.orderItemsService.update(slug, id, updateOrderItemDto);
    return {
      message: 'Item de orden actualizado exitosamente',
      orderItem,
    };
  }

  @Delete(':id')
  @DeleteOrderItemDoc()
  async remove(
    @Param('slug') slug: string,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.orderItemsService.remove(slug, id);
    return {
      message: 'Item de orden eliminado exitosamente',
    };
  }
}
