import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { Order } from 'src/shared/entities/order.entity';
import { Product } from 'src/shared/entities/product.entity';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private dataSource: DataSource,
  ) {}

  async create(slug: string, createOrderItemDto: CreateOrderItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verificar que el restaurante existe
      const restaurant = await queryRunner.manager.findOneBy(Restaurant, { slug });
      if (!restaurant) {
        throw new NotFoundException('Restaurante no encontrado');
      }

      // Verificar que la orden existe y pertenece al restaurante
      const order = await queryRunner.manager.findOneBy(Order, {
        id: createOrderItemDto.orderId,
        restaurant: { id: restaurant.id },
        exist: true,
      });
      if (!order) {
        throw new NotFoundException('Orden no encontrada');
      }

     
      const product = await queryRunner.manager.findOneBy(Product, {
        id: createOrderItemDto.productId,
        restaurant: { id: restaurant.id },
      });
      if (!product) {
        throw new NotFoundException('Producto no encontrado');
      }
      if (!product.is_available) {
        throw new BadRequestException('El producto no está disponible');
      }

     
      const orderItem = queryRunner.manager.create(OrderItem, {
        order,
        product,
        quantity: createOrderItemDto.quantity,
        unit_price: createOrderItemDto.unit_price,
        exist: true,
      });

      const savedOrderItem = await queryRunner.manager.save(OrderItem, orderItem);

    
      const orderItems = await queryRunner.manager.find(OrderItem, {
        where: { order: { id: order.id }, exist: true },
      });

      const totalPrice = orderItems.reduce(
        (total, item) => total + Number(item.unit_price) * item.quantity,
        0,
      );

      await queryRunner.manager.update(Order, order.id, {
        total_price: totalPrice,
      });

      await queryRunner.commitTransaction();

      return savedOrderItem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(slug: string) {
    const restaurant = await this.restaurantRepository.findOneBy({ slug });
    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    return this.orderItemRepository.find({
      where: { exist: true, order: { restaurant: { id: restaurant.id } } },
      relations: ['order', 'product'],
    });
  }

  async findOne(slug: string, id: string) {
    const restaurant = await this.restaurantRepository.findOneBy({ slug });
    if (!restaurant) {
      throw new NotFoundException('Restaurante no encontrado');
    }

    const orderItem = await this.orderItemRepository.findOne({
      where: { id, exist: true, order: { restaurant: { id: restaurant.id } } },
      relations: ['order', 'product'],
    });

    if (!orderItem) {
      throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
    }

    return orderItem;
  }

  async update(slug: string, id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const restaurant = await queryRunner.manager.findOneBy(Restaurant, { slug });
      if (!restaurant) {
        throw new NotFoundException('Restaurante no encontrado');
      }

      const orderItem = await queryRunner.manager.findOne(OrderItem, {
        where: { id, exist: true, order: { restaurant: { id: restaurant.id } } },
        relations: ['order', 'product'],
      });

      if (!orderItem) {
        throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
      }

      
      if (updateOrderItemDto.productId) {
        const product = await queryRunner.manager.findOneBy(Product, {
          id: updateOrderItemDto.productId,
          restaurant: { id: restaurant.id },
        });
        if (!product) {
          throw new NotFoundException('Producto no encontrado');
        }
        if (!product.is_available) {
          throw new BadRequestException('El producto no está disponible');
        }
        orderItem.product = product;
      }

      
      Object.assign(orderItem, updateOrderItemDto);
      const updatedOrderItem = await queryRunner.manager.save(OrderItem, orderItem);

      
      const orderItems = await queryRunner.manager.find(OrderItem, {
        where: { order: { id: orderItem.order.id }, exist: true },
      });

      const totalPrice = orderItems.reduce(
        (total, item) => total + Number(item.unit_price) * item.quantity,
        0,
      );

      await queryRunner.manager.update(Order, orderItem.order.id, {
        total_price: totalPrice,
      });

      await queryRunner.commitTransaction();

      return updatedOrderItem;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(slug: string, id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const restaurant = await queryRunner.manager.findOneBy(Restaurant, { slug });
      if (!restaurant) {
        throw new NotFoundException('Restaurante no encontrado');
      }

      const orderItem = await queryRunner.manager.findOne(OrderItem, {
        where: { id, exist: true, order: { restaurant: { id: restaurant.id } } },
        relations: ['order'],
      });

      if (!orderItem) {
        throw new NotFoundException(`Item de orden con ID ${id} no encontrado`);
      }

      
      orderItem.exist = false;
      await queryRunner.manager.save(OrderItem, orderItem);

      
      const orderItems = await queryRunner.manager.find(OrderItem, {
        where: { order: { id: orderItem.order.id }, exist: true },
      });

      const totalPrice = orderItems.reduce(
        (total, item) => total + Number(item.unit_price) * item.quantity,
        0,
      );

      await queryRunner.manager.update(Order, orderItem.order.id, {
        total_price: totalPrice,
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
