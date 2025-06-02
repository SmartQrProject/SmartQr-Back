// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Put,
//   Param,
//   Delete,
//   ParseUUIDPipe,
//   UseGuards,
// } from '@nestjs/common';
// import { OrderItemsService } from './order-items.service';
// import { CreateOrderItemDto } from './dto/create-order-item.dto';
// import { UpdateOrderItemDto } from './dto/update-order-item.dto';
// import {
//   CreateOrderItemDoc,
//   GetAllOrderItemsDoc,
//   GetOrderItemByIdDoc,
//   UpdateOrderItemDoc,
//   DeleteOrderItemDoc,
// } from './swagger/order-item.decorator';
// import { ApiBearerAuth } from '@nestjs/swagger';
// import { AuthGuard } from 'src/common/guards/auth.guard';

// @ApiBearerAuth()
// @Controller(':slug/order-items')
// @UseGuards(AuthGuard)
// export class OrderItemsController {
//   constructor(private readonly orderItemsService: OrderItemsService) {}

//   @Post()
//   @CreateOrderItemDoc()
//   async create(
//     @Param('slug') slug: string,
//     @Body() createOrderItemDto: CreateOrderItemDto,
//   ) {
//     const orderItem = await this.orderItemsService.create(slug, createOrderItemDto);
//     return {
//       message: 'Order item created successfully',
//       orderItem,
//     };
//   }

//   @Get()
//   @GetAllOrderItemsDoc()
//   async findAll(@Param('slug') slug: string) {
//     const orderItems = await this.orderItemsService.findAll(slug);
//     return {
//       message: 'Order items retrieved successfully',
//       orderItems,
//     };
//   }

//   @Get(':id')
//   @GetOrderItemByIdDoc()
//   async findOne(
//     @Param('slug') slug: string,
//     @Param('id', ParseUUIDPipe) id: string,
//   ) {
//     const orderItem = await this.orderItemsService.findOne(slug, id);
//     return {
//       message: 'Order item retrieved successfully',
//       orderItem,
//     };
//   }

//   @Put(':id')
//   @UpdateOrderItemDoc()
//   async update(
//     @Param('slug') slug: string,
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() updateOrderItemDto: UpdateOrderItemDto,
//   ) {
//     const orderItem = await this.orderItemsService.update(slug, id, updateOrderItemDto);
//     return {
//       message: 'Order item updated successfully',
//       orderItem,
//     };
//   }

//   @Delete(':id')
//   @DeleteOrderItemDoc()
//   async remove(
//     @Param('slug') slug: string,
//     @Param('id', ParseUUIDPipe) id: string,
//   ) {
//     await this.orderItemsService.remove(slug, id);
//     return {
//       message: 'Order item deleted successfully',
//     };
//   }
// }
