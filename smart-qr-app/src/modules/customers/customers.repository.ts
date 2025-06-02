import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/common/services/mail.service';
import { Auth0CustomerDto } from './dto/auth0-customer.dto';
import { plainToInstance } from 'class-transformer';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { Restaurant } from 'src/shared/entities/restaurant.entity';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly bcryptService: BcryptService,
    private mailService: MailService,
  ) {}

  // ------ trabajando en este endpoint ---GEA Mayo 14-
  async sincronizarAuth0(customer /*: Auth0CustomerDto*/, rest: Restaurant) {
    const { auth0Id, email, name, picture } = customer;

    let existing = await this.customerRepository.findOne({
      where: { auth0Id },
      relations: ['restaurant'],
    });

    if (existing) {
      // Validación: evitar modificar el auth0Id si se intenta forzar otro distinto

      return {
        id: existing.id,
        auth0Id: existing.auth0Id,
        email: existing.email,
        name: existing.name,
        picture: existing.picture,
        phone: existing.phone,
        reward: existing.reward,
        last_visit: existing.last_visit,
        visits_count: existing.visits_count,
        created_at: existing.created_at,
        modified_at: existing.modified_at,
        restaurant: {
          name: existing.restaurant?.name,
          slug: existing.restaurant?.slug,
        },
        exist: existing.exist,
      };
    }

    const newCustomer = this.customerRepository.create({
      auth0Id,
      email,
      name,
      picture,
      exist: true,
      restaurant: rest,
    });

    const saved = await this.customerRepository.save(newCustomer);

    return {
      id: saved.id,
      auth0Id: saved.auth0Id,
      email: saved.email,
      name: saved.name,
      picture: saved.picture,
      phone: saved.phone,
      reward: saved.reward,
      last_visit: saved.last_visit,
      visits_count: saved.visits_count,
      created_at: saved.created_at,
      modified_at: saved.modified_at,
      restaurant: {
        name: saved.restaurant?.name,
        slug: saved.restaurant?.slug,
      },
      exist: saved.exist,
    };
  }

  // GEA 14-mayo
  async createCustomer(createCustomer, rest): Promise<Omit<Customer, 'password'>> {
    const hash = await this.bcryptService.hash(createCustomer.password);
    if (!hash) {
      throw new InternalServerErrorException('Problem with the bcrypt library');
    }

    const newCustomer = { ...createCustomer, password: hash };
    newCustomer.restaurant = rest;
    this.customerRepository.create(newCustomer);
    const customerCreado = await this.customerRepository.save(newCustomer);
    const { password, ...customerSinPass } = customerCreado;

    // const subject = 'Satisfactory Account Creation in our SmartQR App';
    // const textmsg =
    //   'Congratulations!!!! Your have been granted access to use the SmartQR App.';
    // const tipoEmail = 'signIn';
    // this.mailService.sendMail(
    //   customerCreado.email,
    //   subject,
    //   textmsg,
    //   tipoEmail,
    // );
    return customerSinPass;
  }

  // GEA 14-mayo
  async updateById(id: string, updateCustomer: UpdateCustomerDto): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOneBy({ id });

    if (!customer) {
      throw new NotFoundException(`❌ No customer found with id ${id} !!`);
    }

    const merged = this.customerRepository.merge(customer, updateCustomer);
    await this.customerRepository.save(merged);

    const { password, ...sanitized } = merged;
    return sanitized;
  }

  // GEA FINALIZADO Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async removeById(id: string, req): Promise<string> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });

    if (!customer) {
      throw new NotFoundException(`❌ Customer with id ${id} not found !!!`);
    }

    // if (!req.user.roles.includes('superAdmin') && req.customer.id !== id) {
    //   throw new NotFoundException(
    //     `You can not delete a Customer account of a different customer.`,
    //   );
    // }

    customer.exist = false;
    // const mergeUser = this.userRepository.merge(user, putUser);
    // await this.userRepository.save(mergeUser);
    await this.customerRepository.save(customer);
    return 'Customer blocked: ' + id;
  }

  // GEA FINALIZADO Mayo 14
  async getAllCustomers(
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    customers: Omit<Customer, 'password'>[];
  }> {
    const skip = (page - 1) * limit;
    const [customers, total] = await this.customerRepository.findAndCount({
      skip,
      take: limit,
      order: { name: 'ASC' },
    });

    if (!customers) {
      throw new NotFoundException('❌ No customers found');
    }

    const customersSinClave = customers.map(({ password, ...resto }) => resto);
    return { page, limit, customers };
  }

  // GEA FINALIZADO Mayo 14
  async findById(id: string, slug: string): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository
      .createQueryBuilder('customer')
      .leftJoinAndSelect('customer.orders', 'orders')
      .leftJoinAndSelect('orders.restaurant', 'restaurant')
      .leftJoinAndSelect('orders.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .leftJoinAndSelect('orders.table', 'table')
      .where('customer.id = :id', { id })
      .setParameter('id', id)
      .setParameter('slug', slug)
      .getOne();

    if (!customer) {
      throw new NotFoundException('❌ No customer found');
    }

    // 🔍 Filtrar solo órdenes activas y del restaurante correcto
    customer.orders = (customer.orders || []).filter((order) => order.status !== 'inactive' && order.restaurant?.slug === slug);

    const { password, ...customerSinPass } = customer as any;
    return customerSinPass;
  }

  // Finalizado GEA Mayo-14
  async getCustomerByEmail(email: string): Promise<Customer | null> {
    const customer = await this.customerRepository.findOne({
      where: { email },
    });
    return customer;
  }

  //   async create({ auth0Id, email, name, picture }) {
  //     const newCustomer = this.customerRepository.create({
  //       id: auth0Id,
  //       email: email,
  //       name: name,
  //       picture: picture,
  //     });

  //     await this.customerRepository.save(newCustomer);
  //     return this.customerRepository.save(newCustomer);
  //   }

  // }
}
