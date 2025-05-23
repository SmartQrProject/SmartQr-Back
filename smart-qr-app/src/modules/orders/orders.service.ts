import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
import { Order } from 'src/shared/entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { Product } from 'src/shared/entities/product.entity';
import { OrderItem } from 'src/shared/entities/order-item.entity';
import { In } from 'typeorm';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { RewardCodeService } from '../reward-code/reward-code.service';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly rewardCodeService: RewardCodeService,
    private dataSource: DataSource,
    private mailService: MailService,
  ) {}

  async create(createOrderDto: CreateOrderDto, slug: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Buscar entidades relacionadas
      const customer = await queryRunner.manager.findOneBy(Customer, {
        id: createOrderDto.customerId,
      });
      if (!customer) throw new NotFoundException('Cliente no encontrado');

      const restaurant = await queryRunner.manager.findOneBy(Restaurant, {
        slug: slug,
      });
      if (!restaurant) throw new NotFoundException('Restaurante no encontrado');

      const table = await queryRunner.manager.findOneBy(RestaurantTable, {
        code: createOrderDto.code,
      });
      if (!table) throw new NotFoundException('Mesa no encontrada');

      // 2. Obtener y validar productos
      const requestedProductIds = createOrderDto.products.map((prod) => prod.id);
      const availableProducts = await queryRunner.manager.findBy(Product, {
        id: In(requestedProductIds),
      });

      for (const { id } of createOrderDto.products) {
        const product = availableProducts.find((prod) => prod.id === id);
        if (!product || !product.is_available) {
          throw new BadRequestException(`Producto con ID ${id} no disponible`);
        }
      }

      // 3. Crear items de orden
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const { id, quantity } of createOrderDto.products) {
        const product = availableProducts.find((prod) => prod.id === id)!;
        const unit_price = Number(product.price);

        totalPrice += parseFloat((totalPrice + unit_price * quantity).toFixed(2));

        const orderItem = queryRunner.manager.create(OrderItem, {
          product,
          quantity,
          unit_price,
        });

        const savedItem = await queryRunner.manager.save(OrderItem, orderItem);
        orderItems.push(savedItem);
      }

      // 3,5. Aplicar código de recompensa
      let discountPercentage = 0;
      if (createOrderDto.rewardCode) {
        const rewardCode = await this.rewardCodeService.findOneByCode(createOrderDto.rewardCode);

        if (!rewardCode || !rewardCode.isActive || !rewardCode.exist) {
          throw new BadRequestException('Código de recompensa inválido o ya utilizado');
        }

        discountPercentage = rewardCode.percentage;

        const discount = totalPrice * (discountPercentage / 100);
        totalPrice -= discount;

        await this.rewardCodeService.deactivateCode(rewardCode.code);
      }

      // 4. Crear y guardar orden
      const newOrder = queryRunner.manager.create(Order, {
        customer,
        restaurant,
        table,
        //order_type: createOrderDto.orderType,
        //payStatus: createOrderDto.payStatus,
        //status: 'pending',
        total_price: totalPrice,
        items: orderItems,
      });

      const savedOrder = await queryRunner.manager.save(Order, newOrder);

      await queryRunner.commitTransaction();

      // 5. Generacion email al cliente con su Order
      const order = {
        orderId: savedOrder.id,
        total: totalPrice,
        rewardCode: createOrderDto.rewardCode ?? null,
        discountPercentage,
        items: orderItems.map((prod) => ({
          productId: prod.product.id,
          quantity: prod.quantity,
          unit_price: prod.unit_price,
        })),
      };
      this.sendEmail(customer, restaurant, order, 'created'); //nodemailer

      return order;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return this.orderRepository.find({ where: { exist: true } });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, exist: true },
    });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada o fue eliminada`);
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const existingOrder = await this.orderRepository.findOne({
      where: { id },
    });

    if (!existingOrder) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    const updatedOrder = this.orderRepository.merge(existingOrder, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Orden con ID ${id} no encontrada`);
    }

    order.exist = false;
    return this.orderRepository.save(order);
  }

  async sendEmail(customer: Customer, restaurant: Restaurant, order, accion) {
    const subject = `Your Order # ${order.orderId} was ${accion} and have been sent to preparation. `;
    const textmsg = `Hello ${customer.name},  the following Order has been ${accion} in the Restaurant ${restaurant.name}.
      - Total Amount: ${order.total}`;
    const htmlTemplate = 'basico';
    await this.mailService.sendMail(customer.email, subject, textmsg, htmlTemplate);
  }
}
