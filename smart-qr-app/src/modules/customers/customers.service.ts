import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Customer } from 'src/shared/entities/customer.entity';
import { CustomersRepository } from './customers.repository';

import { UpdateCustomerDto } from './dto/update-customer.dto';
import { RegisterDto } from './dto/register.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private customersRepository: CustomersRepository,
    @Inject() private bcrypt: BcryptService,
  ) {}

  async validateUserFromToken(payload: any) {
    // Podés verificar si existe en DB, sincronizar, etc.
    return payload;
  }

  async syncCustomerFromToken(payload): Promise<Customer | void> {
    const customer = await this.customersRepository.findAuthId(payload.sub);

    //if (customer) return customer;

    // Si no existe, lo creamos
    //const newCustomer = this.customersRepository.create(payload);
    //return newCustomer;
    return;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async register(email: string, password: string) {
    const existing = await this.customerRepo.findOne({ where: { email } });
    if (existing) throw new UnauthorizedException('Email ya registrado');

    const hash = await this.bcrypt.hash(password);

    const user = this.customerRepo.create({
      email,
      password: hash,
      provider: 'local',
    });

    return this.customerRepo.save(user);
  }

  async login(email: string, password: string) {
    const user = await this.customerRepo.findOne({
      where: { email, provider: 'local' },
    });
    if (!user || !user.password)
      throw new UnauthorizedException('Credenciales inválidas');

    const match = await this.bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Credenciales inválidas');

    return user;
  }

  async loginWithAuth0(auth0Id: string) {
    const user = await this.customerRepo.findOne({
      where: { auth0Id, provider: 'auth0' },
    });

    if (!user) {
      const newUser = this.customerRepo.create({
        auth0Id,
        provider: 'auth0',
      });
      return this.customerRepo.save(newUser);
    }

    return user;
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  findAll() {
    return `This action returns all customers`;
  }

  async findAuthId(payload) {
    return `This action returns a #${payload} customer`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customer`;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }
}
