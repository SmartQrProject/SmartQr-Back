import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { StripeService } from '../stripe/stripe.service';

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
    @Inject(forwardRef(() => StripeService))
    private readonly stripeService: StripeService,
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
      if (!customer) throw new NotFoundException('Customer not found');

      const restaurant = await queryRunner.manager.findOneBy(Restaurant, {
        slug: slug,
      });
      if (!restaurant) throw new NotFoundException('Restaurant not found');

      const table = await queryRunner.manager.findOneBy(RestaurantTable, {
        code: createOrderDto.code,
      });
      if (!table) throw new NotFoundException('Table not found');

      // 2. Obtener y validar productos
      const requestedProductIds = createOrderDto.products.map((prod) => prod.id);
      const availableProducts = await queryRunner.manager.findBy(Product, {
        id: In(requestedProductIds),
      });

      for (const { id } of createOrderDto.products) {
        const product = availableProducts.find((prod) => prod.id === id);
        if (!product || !product.is_available) {
          throw new BadRequestException(`Product with ID ${id} is not available`);
        }
      }

      // 3. Crear items de orden
      let totalPrice = 0;
      const orderItems: OrderItem[] = [];

      for (const { id, quantity } of createOrderDto.products) {
        const product = availableProducts.find((prod) => prod.id === id)!;
        const unit_price = Number(product.price);

        totalPrice += unit_price * quantity;
        totalPrice = parseFloat(totalPrice.toFixed(2));

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
          throw new BadRequestException('Invalid or already used reward code');
        }

        discountPercentage = rewardCode.percentage;

        const discount = totalPrice * (discountPercentage / 100);
        totalPrice -= discount;
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
      const stripeLineItems = orderItems.map((item) => {
        const discountedUnitPrice = discountPercentage ? item.unit_price - (item.unit_price * discountPercentage) / 100 : item.unit_price;

        return {
          price_data: {
            currency: 'aud',
            product_data: {
              name: item.product.name,
              description: item.product.description ?? '',
            },
            unit_amount: Math.round(discountedUnitPrice * 100), // 👈 precio ya con descuento
          },
          quantity: item.quantity,
        };
      });

      const stripeSession = await this.stripeService.createCheckoutSession(stripeLineItems, savedOrder.id, createOrderDto.rewardCode);

      await queryRunner.commitTransaction();

      // 5. Generacion email al cliente con su Order
      const order2Email = await this.orderRepository.findOne({
        where: { id: savedOrder.id, exist: true },
        relations: ['items', 'restaurant'],
      });
      if (!order2Email) {
        throw new NotFoundException(`Order with ID ${savedOrder.id} not found`);
      }
      this.sendEmail(customer, restaurant, order2Email, 'created'); //nodemailer

      return { order: order2Email, stripeSession: stripeSession.url };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(slug: string): Promise<any[]> {
    const orders = await this.orderRepository
      .createQueryBuilder('order')
      .leftJoin('order.restaurant', 'restaurant')
      .leftJoin('order.customer', 'customer')
      .leftJoin('order.table', 'table')
      .leftJoin('order.items', 'item')
      .leftJoin('item.product', 'product')
      .where('restaurant.slug = :slug', { slug })
      .andWhere('order.exist = true')
      .select([
        'order.id',
        'order.status',
        'order.order_type',
        'order.total_price',
        'order.created_at',

        'table.id',

        'restaurant.slug',

        'customer.id',
        'customer.name',
        'customer.email',
        'customer.phone',

        'item.id',
        'item.quantity',

        'product.id',
        'product.name',
        'product.description',
        'product.price',
      ])
      .orderBy('order.created_at', 'DESC')
      .getMany();

    return orders.map((order) => ({
      id: order.id,
      status: order.status,
      order_type: order.order_type,
      tableId: order.table?.id,
      restaurantSlug: order.restaurant?.slug,
      userId: order.customer?.id,
      created_at: order.created_at,
      total_price: order.total_price,
      customer: {
        name: order.customer?.name,
        email: order.customer?.email,
        phone: order.customer?.phone,
      },
      items: order.items.map((item) => ({
        id: item.id,
        name: item.product?.name,
        description: item.product?.description,
        price: item.product?.price,
        quantity: item.quantity,
      })),
    }));
  }

  async findOne(id: string, slug) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const rest = await queryRunner.manager.findOneBy(Restaurant, {
      slug: slug,
    });
    if (!rest) throw new NotFoundException(`Restaurant not found with this Slug: ${slug}`);

    const order = await this.orderRepository.findOne({
      where: { id, exist: true },
      relations: ['items', 'restaurant'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (order.restaurant.id !== rest.id) {
      throw new NotFoundException(`Order: ${order.id} not beloging to this Slug: ${slug} `);
    }

    // this.sendEmail(order.customer, rest, order, 'test'); // test nodemailer

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto, slug) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    const rest = await queryRunner.manager.findOneBy(Restaurant, {
      slug: slug,
    });
    if (!rest) throw new NotFoundException(`Restaurant not found with this Slug: ${slug}`);

    const existingOrder = await this.orderRepository.findOne({
      where: { id },
      relations: ['items', 'restaurant'],
    });

    if (!existingOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    if (existingOrder.restaurant.id !== rest.id) {
      throw new NotFoundException(`Order: ${existingOrder.id} not beloging to this Slug: ${slug} `);
    }

    const updatedOrder = this.orderRepository.merge(existingOrder, updateOrderDto);
    const returnedOrder = this.orderRepository.save(updatedOrder);
    this.sendEmail(updatedOrder.customer, rest, updatedOrder, 'updated'); //nodemailer
    return returnedOrder;
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    order.exist = false;
    return this.orderRepository.save(order);
  }

  async sendEmail(customer: Customer, restaurant: Restaurant, order: Order, accion) {
    const subject = `Your Order # ${order.id} was ${accion} and have been sent to preparation. `;
    const headerText = `Hello ${customer.name}, <br>  the following Order has been ${accion}.<br>
    - Restaurant    : ${restaurant.name}<br>      
    - Total Amount  : ${order.total_price} u$d <br>
    - Discount      : ${order.discount_applied} <br>
    - Payment Status: ${order.payStatus} 
    - Order   Status: ${order.status} <br><br>`;

    const itemsText = order.items
      .map((item) => `${this.formatString(item.product.name, 20)} x ${this.formatString(item.quantity, 5)} - $${this.formatString(item.unit_price, 7)}`)
      .join('<br>');

    const htmlTemplate = 'order';
    await this.mailService.sendMail(customer.email, subject, headerText + itemsText, htmlTemplate);
  }

  async activateOrder(orderId: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, exist: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    order.status = 'pending'; // <-- Aquí definís el nuevo estado
    order.payStatus = 'paid'; // (opcional) si usás este campo también

    return this.orderRepository.save(order);
  }

  formatString(value, lon) {
    const str = String(value); // asegura que sea string
    return str.slice(0, lon).padEnd(lon, ' ');
  }
}
