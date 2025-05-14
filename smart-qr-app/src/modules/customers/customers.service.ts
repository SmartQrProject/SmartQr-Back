import { Injectable } from '@nestjs/common';
import { Customer } from 'src/shared/entities/customer.entity';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private customersRepository: CustomersRepository) {}

  async sincronizarAuth0(customer): Promise<Customer> {
    return await this.customersRepository.sincronizarAuth0(customer);
  }

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

  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

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
