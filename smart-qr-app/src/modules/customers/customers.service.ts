import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Customer } from 'src/shared/entities/customer.entity';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { LogInCustomerDto } from './dto/login-customer.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class CustomersService {
  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly bcryptService: BcryptService,
    private readonly restaurantService: RestaurantsService,
    private readonly jwtService: JwtService,
  ) {}

  async sincronizarAuth0(customer, slug): Promise<Customer> {
    const rest = await this.restaurantService.getRestaurants(slug);
    return await this.customersRepository.sincronizarAuth0(customer, rest);
  }

  // en principio no se usa - GEA
  async validateUserFromToken(payload: any) {
    // Podés verificar si existe en DB, sincronizar, etc.
    return payload;
  }

  // en principio no se usa - GEA
  async syncCustomerFromToken(payload): Promise<Customer | void> {
    // const customer = await this.customersRepository.findAuthId(payload.sub);

    //if (customer) return customer;

    // Si no existe, lo creamos
    //const newCustomer = this.customersRepository.create(payload);
    //return newCustomer;
    return;
  }

  // GEA listo mayo-14
  async create(
    createCustomer: CreateCustomerDto,
    slug,
  ): Promise<Omit<Customer, 'password'>> {
    const rest = await this.restaurantService.getRestaurants(slug);
    if (createCustomer.password !== createCustomer.confirmPassword) {
      throw new ConflictException('❌ Passwords are not equals!!!');
    }
    return this.customersRepository.createCustomer(createCustomer, rest);
  }

  // FINALIZDO GEA MAYO-14
  async getAllCustomers(
    page,
    limit,
  ): Promise<{
    page: number;
    limit: number;
    customers: Omit<Customer, 'password'>[];
  }> {
    return this.customersRepository.getAllCustomers(page, limit);
  }

  // FINALIZDO GEA MAYO-14
  findOne(id) {
    return this.customersRepository.findById(id);
  }

  // FINALIZDO GEA MAYO-14
  update(id, updateCustomer: UpdateCustomerDto, req) {
    return this.customersRepository.updateById(id, updateCustomer, req);
  }

  // FINALIZDO GEA MAYO-14
  removeById(id, req): Promise<string> {
    return this.customersRepository.removeById(id, req);
  }

  async customerLogin({ email, password }: LogInCustomerDto): Promise<object> {
    const customer = await this.customersRepository.getCustomerByEmail(email);

    console.log(customer);
    console.log(email, password);
    if (
      !customer ||
      !customer.exist ||
      customer.auth0Id ||
      !customer.password ||
      !(await this.bcryptService.compare(password, customer.password))
    ) {
      throw new UnauthorizedException('Not valid Credentials');
    }

    const jwtPayLoad = {
      sub: customer.id,
      id: customer.id,
      email: customer.email,
    };

    const access_token = this.jwtService.generateToken(jwtPayLoad);
    return { success: 'Logged Succesfully with token', access_token };
  }

  // FINALIZDO GEA MAYO-14-----
  async updateById(id, customer, req): Promise<Omit<Customer, 'password'>> {
    if (customer.password !== customer.confirmPassword) {
      throw new ConflictException('Passwords are not equals!!!');
    }
    return this.customersRepository.updateById(id, customer, req);
  }
}
