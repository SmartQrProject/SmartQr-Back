import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Customer) private userRepository: Repository<Customer>,
    @InjectRepository(Order) private orderRepository: Repository<Order>,
    @InjectRepository(Product) private productRepository: Repository<Product>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private readonly rewardCodeService: RewardCodeService,
    private dataSource: DataSource,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
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
        id: createOrderDto.restaurantId,
      });
      if (!restaurant) throw new NotFoundException('Restaurante no encontrado');

      const table = await queryRunner.manager.findOneBy(RestaurantTable, {
        id: createOrderDto.tableId,
      });
      if (!table) throw new NotFoundException('Mesa no encontrada');

      // 2. Obtener y validar productos
      const requestedProductIds = createOrderDto.products.map(
        (prod) => prod.id,
      );
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

        totalPrice += unit_price * quantity;

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
        const rewardCode = await this.rewardCodeService.findOneByCode(
          createOrderDto.rewardCode,
        );

        if (!rewardCode || !rewardCode.isActive || !rewardCode.exist) {
          throw new BadRequestException(
            'Código de recompensa inválido o ya utilizado',
          );
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

      return {
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
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const mockOrders = [
      {
        id: 'dae54111-e7a4-45c3-9263-e5ded75b1c70',
        status: 'served',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 76.23,
        created_at: '2025-05-16T10:02:03.332181',
        tableId: '85dbb533-1d56-470a-bd01-82bfbc3f03e3',
        customerId: '1d2cd0af-8689-47c1-bf05-4f937798d9de',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '333ab6d4-c2d6-47ac-8f53-1fff0651ade0',
        status: 'pending',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 12.18,
        created_at: '2025-05-16T10:02:03.332782',
        tableId: '50f8c760-5a1d-48bf-9a92-7fccb8b665b5',
        customerId: '4a760f14-b97a-41a8-ae45-4b833e8ea2d8',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '848a5d80-f5df-49fc-8c52-c788a07cf542',
        status: 'completed',
        payStatus: 'paid',
        order_type: 'dine-in',
        total_price: 59.73,
        created_at: '2025-05-16T10:02:03.333880',
        tableId: '15fbffb3-6fa5-407f-a605-95a5e0036ede',
        customerId: '3434d3f8-0c4b-4577-9a7d-90d89af4cb1e',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '19c51f58-f4aa-47ed-a624-e5d2e2338e5a',
        status: 'completed',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 99.85,
        created_at: '2025-05-16T10:02:03.334370',
        tableId: '0f994978-94d2-43fd-b4d8-17ec65b60fe1',
        customerId: 'f6d79cac-e81f-4825-9b6b-13c5da100a92',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '473d84f1-b1ce-4f40-be2d-9fa6df8db1d9',
        status: 'completed',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 13.97,
        created_at: '2025-05-16T10:02:03.334527',
        tableId: '6d15f387-09e0-4adc-9b34-c3556e941c1e',
        customerId: 'be2ba746-1a98-4622-b83a-0cf4e5f116f1',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: 'b0be276f-8f36-43f2-93ad-ccc134dac1d5',
        status: 'served',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 79.86,
        created_at: '2025-05-16T10:02:03.334599',
        tableId: 'b7591959-4606-4e0b-b0da-9ae36393bf72',
        customerId: 'a345ec08-ae24-44fc-ac29-b3606c07c517',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '55ee9863-fb52-4078-bc8d-8f69148b0f25',
        status: 'served',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 43.99,
        created_at: '2025-05-16T10:02:03.334619',
        tableId: '472a0371-718d-4ae8-833f-a6589cdcc317',
        customerId: 'f9d249f0-0f50-4e6f-b387-7cfabf23b878',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: 'b67040b9-cff2-43e0-9760-793c951088f8',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'dine-in',
        total_price: 59.78,
        created_at: '2025-05-16T10:02:03.334644',
        tableId: '84d8ff59-ecdb-4a6e-8823-628a5377f9ca',
        customerId: '35fc3070-1d9b-47d6-af6a-f5d1a13e33c2',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '7310fa01-83af-4e40-9e21-5382c7174a30',
        status: 'served',
        payStatus: 'paid',
        order_type: 'dine-in',
        total_price: 36.79,
        created_at: '2025-05-16T10:02:03.334666',
        tableId: 'f5958c68-adad-4e01-990d-2d3e4e97cc21',
        customerId: 'f6e0e05b-557e-46e0-bb89-f037abff6ca7',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '96a770d8-c251-4838-984c-30b144edf5fa',
        status: 'completed',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 52.22,
        created_at: '2025-05-16T10:02:03.334694',
        tableId: '030535d4-d544-4f9e-9f4e-22f09e133827',
        customerId: '018a99ee-0399-4ebb-8c44-77481d61e81a',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: 'f2cb41f2-04a0-4b3c-bc02-842870d0618f',
        status: 'served',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 66.36,
        created_at: '2025-05-16T10:02:03.334752',
        tableId: '8277d826-c6b4-4f5d-9217-7b573bd07c90',
        customerId: '2a6d5e59-a420-47b9-83d2-76c9636cea8b',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: 'b6ad8835-fd9f-47a1-922d-b613b038f1be',
        status: 'pending',
        payStatus: 'unpaid',
        order_type: 'takeaway',
        total_price: 58.76,
        created_at: '2025-05-16T10:02:03.334809',
        tableId: 'eccfa312-5555-482f-a568-5b5383287338',
        customerId: '1791da64-6775-441b-83a9-0185ca90e21e',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '46d9ef2c-3c04-455d-8419-b53b6a047846',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 14.2,
        created_at: '2025-05-16T10:02:03.334828',
        tableId: 'b7c1ec59-4405-4d08-ae3d-6c33125993a8',
        customerId: '7206686e-7b9a-4506-8635-c00c011e2f9c',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: 'a2e4b71d-ddfc-4100-9f27-19f9ada3d563',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 15.98,
        created_at: '2025-05-16T10:02:03.334845',
        tableId: '40e111c8-cc51-45ec-823c-023c32a1e50e',
        customerId: 'f03fb58a-527e-48cb-8662-59f332e434ba',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '9c8687da-6b38-490a-b9fd-529dbceef007',
        status: 'served',
        payStatus: 'unpaid',
        order_type: 'takeaway',
        total_price: 66.69,
        created_at: '2025-05-16T10:02:03.334863',
        tableId: '09a336c8-64b0-4c78-87eb-555e2c2cbf91',
        customerId: '4293644c-9431-478d-9367-ad533e8ba398',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '436235a2-bfb4-4dbb-8652-82ea094609c7',
        status: 'completed',
        payStatus: 'unpaid',
        order_type: 'takeaway',
        total_price: 16.1,
        created_at: '2025-05-16T10:02:03.334881',
        tableId: 'b56dc03e-b7b4-46c9-ada0-176e1ea24724',
        customerId: '5a28c2e9-4998-4f1c-985f-50bcb7faa66b',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '914da7bf-4ca6-40e2-a07d-3ac68bc0e91a',
        status: 'served',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 95.1,
        created_at: '2025-05-16T10:02:03.334901',
        tableId: 'b4320393-7148-4060-b472-65a29399e34a',
        customerId: 'f1cfb11e-6fb9-4ee1-a0db-37559e73317c',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '0662dc0b-1468-4748-af3c-d40453e2c8c9',
        status: 'served',
        payStatus: 'paid',
        order_type: 'dine-in',
        total_price: 28.99,
        created_at: '2025-05-16T10:02:03.334925',
        tableId: 'd40030c2-ce05-4be7-8f99-64098c563221',
        customerId: 'dce6ceff-b333-410f-bdab-fde2aa2fe50f',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '82584308-6e84-4e33-b4ed-e11d06942087',
        status: 'served',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 25.22,
        created_at: '2025-05-16T10:02:03.334942',
        tableId: '9287f0a8-5e79-4b4d-820e-97b24a57c60d',
        customerId: '6ced2640-30e0-4a6a-b6a3-e39167e7b5e7',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '1977209e-bca6-4266-983d-54749748d9a2',
        status: 'served',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 74.22,
        created_at: '2025-05-16T10:02:03.334961',
        tableId: 'c9921dcd-b9a7-4037-8541-3d9dad95d2a7',
        customerId: 'dad89c0c-b5d0-44b6-a4fa-7168cd171131',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '6af11ab4-19f3-42a9-8370-cdee5cd0efac',
        status: 'served',
        payStatus: 'unpaid',
        order_type: 'takeaway',
        total_price: 76.2,
        created_at: '2025-05-16T10:02:03.334979',
        tableId: '68df5c56-46ee-4e6e-aa25-3210b1f5ced6',
        customerId: '65db8834-b42b-455d-a8b1-fef4a3c02c9c',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '69c08324-aad6-4b12-9d50-3e2200588f3b',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 49.67,
        created_at: '2025-05-16T10:02:03.334998',
        tableId: '278f3ee5-d41c-4738-818f-9dc2138fe00d',
        customerId: 'a9e62e2f-ec80-413e-b758-16fcbf5490a4',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '5ad5e0cd-f984-4034-b5f5-2aacb1f9873c',
        status: 'served',
        payStatus: 'unpaid',
        order_type: 'takeaway',
        total_price: 34.77,
        created_at: '2025-05-16T10:02:03.335015',
        tableId: '7ae11078-00fb-47d1-8c92-cbb827cebe95',
        customerId: '6b9f8bb3-5a5e-4286-b9fc-deb564e4099f',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '0de06ee6-1d3d-4e37-9ed7-e3566fad96c0',
        status: 'pending',
        payStatus: 'unpaid',
        order_type: 'takeaway',
        total_price: 21.58,
        created_at: '2025-05-16T10:02:03.335032',
        tableId: 'f7420aef-1728-4fde-b1f8-df46b4e8382e',
        customerId: '68ccabfe-195c-42d1-a8a4-4987ec121b80',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '4cd40f48-7f9d-4836-8af3-22f8fbfd0a66',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 60.52,
        created_at: '2025-05-16T10:02:03.335049',
        tableId: 'dadcd016-9d82-447e-8049-4e0478586314',
        customerId: '9db7a91f-1564-46ba-8581-40a4bf7d7241',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '729038b0-f26e-4e1e-b8f4-54bfa517c8ea',
        status: 'served',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 30.36,
        created_at: '2025-05-16T10:02:03.335067',
        tableId: '09e151d8-ea9c-46ad-8979-83683a94f0ed',
        customerId: '8b02c992-545b-4ded-ae9b-37e308e13e05',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: 'd226c95d-6765-4481-bf43-71642b4cbe1e',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 45.24,
        created_at: '2025-05-16T10:02:03.335086',
        tableId: '40a894fd-ac6f-4eca-8d37-cf606a5e0d1d',
        customerId: '5dba065b-8903-498a-8221-d96433ba45bd',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '232b4256-8bb2-4e4d-933f-8268fee86988',
        status: 'pending',
        payStatus: 'unpaid',
        order_type: 'dine-in',
        total_price: 42.06,
        created_at: '2025-05-16T10:02:03.335102',
        tableId: 'e38b4b90-a843-41c8-9216-654b59d281cc',
        customerId: 'c225a7c3-9cab-408f-9915-7a1e0e795e5a',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '44488424-4568-4545-80f4-a70599540d0c',
        status: 'completed',
        payStatus: 'paid',
        order_type: 'dine-in',
        total_price: 51.25,
        created_at: '2025-05-16T10:02:03.335119',
        tableId: '66e4ce65-9bbf-4bc2-b3a6-194048923e24',
        customerId: '2ebf786f-3192-4201-841d-07aa20b73d40',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
      {
        id: '12970fc1-af49-4104-b2fb-48fb722a057c',
        status: 'pending',
        payStatus: 'paid',
        order_type: 'takeaway',
        total_price: 48.12,
        created_at: '2025-05-16T10:02:03.335135',
        tableId: '42a16fa8-f840-4639-ad44-5d818389d97e',
        customerId: '577431a1-4f27-4cc1-afe8-25460a06519e',
        restaurantId: '674e111b-7bca-4126-8096-2764a34d6352',
        exist: true,
      },
    ];

    return mockOrders;
    //return this.orderRepository.find({ where: { exist: true } });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id, exist: true },
    });

    if (!order) {
      throw new NotFoundException(
        `Orden con ID ${id} no encontrada o fue eliminada`,
      );
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

    const updatedOrder = this.orderRepository.merge(
      existingOrder,
      updateOrderDto,
    );
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
}
