import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
import { UpdateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly bcryptService: BcryptService,
    private mailService: MailService,
  ) {}

  // ------ trabajando en este endpoint ---GEA Mayo 14-
  async sincronizarAuth0(customer, rest): Promise<Customer> {
    // ¿Ya existe un usuario con este sub (de Auth0)?
    const { email, name, auth0Id, picture } = customer;

    let wrkCust = await this.customerRepository.findOne({
      where: { auth0Id: auth0Id },
    });

    if (wrkCust) {
      wrkCust.exist = true;
      wrkCust.restaurant = rest;
      this.customerRepository.merge(wrkCust, customer);
      const wrk2Cust = await this.customerRepository.save(wrkCust);
      return wrk2Cust;
    }

    // Si no existe, lo creamos
    const newCustomer = this.customerRepository.create({
      auth0Id: auth0Id,
      email: email,
      name: name,
      picture: picture,
      restaurant: rest,
    });

    const wrk3Cust = await this.customerRepository.save(newCustomer);
    return wrk3Cust;
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
  async updateById(id, updateCustomer, req): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOneBy({ id: id });

    if (!customer) {
      throw new NotFoundException(`❌ No customer found  with id ${id}  !!`);
    }

    // console.log('req.user', req.user);
    // console.log('req.customer', req.customer);

    // if (!req.user?.roles?.includes('superAdmin') && req.customer.id !== id) {
    //   throw new NotFoundException(
    //     `You can not update Customer data for a different user.`,
    //   );
    // }

    const wrkCustomer = await this.getCustomerByEmail(updateCustomer.email);
    if (wrkCustomer && wrkCustomer.id !== id) {
      throw new ConflictException(`❌ Email already in use: ${customer.email} !!`);
    }

    const hash = await this.bcryptService.hash(updateCustomer.password);
    if (!hash) {
      throw new InternalServerErrorException('Problem with the bcrypt library');
    }

    updateCustomer.password = hash;
    const { confirmPassword, ...putCustomer } = updateCustomer;
    const mergeCustomer = this.customerRepository.merge(customer, putCustomer);
    await this.customerRepository.save(mergeCustomer);
    const { password, ...sinPassword } = mergeCustomer;
    return sinPassword;
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
    return 'Customer bloquedao: ' + id;
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
  async findById(id): Promise<Omit<Customer, 'password'>> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['orders'],
      loadEagerRelations: false, // ignora los eager de Order
    });

    if (!customer) {
      throw new NotFoundException('❌ No customer found');
    }

    const { password, ...customerSinPass } = customer;
    return customer;
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
