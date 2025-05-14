import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Customer } from 'src/shared/entities/customer.entity';
import { CreateCustomerDto } from 'src/modules/customers/dto/create-customer.dto';
//import { updateCustomerDto } from 'src/modules/customers/dto/update-customer.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { PutUserDto } from '../users/dto/put-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly bcryptService: BcryptService,
  ) {}

  // ------ trabajando en este endpoint ---GEA Mayo 13-
  async putById(id: string, rest, updateCustomer, req): Promise<string> {
    const customer = await this.customerRepository.findOneBy({
      id: id,
      restaurant: { id: rest.id },
    });

    console.log('=======================');
    console.log(customer);
    console.log('=======================');

    if (!customer) {
      throw new NotFoundException(
        `❌ No customer found  with id ${id} for the restaurant ${rest.id} !!`,
      );
    }

    if (!req.user.roles.includes('superAdmin') && req.user.id !== id) {
      throw new NotFoundException(
        `You can not update User data for a different user.`,
      );
    }

    // const usuario = await this.getUserByEmail(updateUser.email);
    // if (usuario && usuario.id !== id) {
    //   throw new ConflictException(
    //     `❌ Email already in use: ${usuario.email} !!`,
    //   );
    // }

    // const hash = await this.bcryptService.hash(updateUser.password);
    // if (!hash) {
    //   throw new InternalServerErrorException('Problem with the bcrypt library');
    // }

    // updateUser.password = hash;
    // const { confirmPassword, ...putUser } = updateUser;
    // const mergeUser = this.userRepository.merge(user, putUser);
    // await this.userRepository.save(mergeUser);
    return id + ' was updated';
  }

  // GEA FINALIZADO Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async deleteById(id: string, rest, req): Promise<string> {
    const user = await this.customerRepository.findOne({
      where: { id },
    });

    // if (!user || user.restaurant.id !== rest.id) {
    //   throw new NotFoundException(
    //     `❌ Usuer with id ${id} not found for this restaurant ${rest.name}!!!`,
    //   );
    // }

    // if (!req.user.roles.includes('superAdmin') && req.user.id !== id) {
    //   throw new NotFoundException(
    //     `You can not delete a User account of a different user.`,
    //   );
    // }
    // await this.userRepository.remove(user);
    return id;
  }

  // GEA FINALIZADO Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async getCustomers(
    rest,
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    usuarios: Omit<Customer, 'password'>[];
  }> {
    const skip = (page - 1) * limit;
    const [usuarios, total] = await this.customerRepository.findAndCount({
      skip,
      take: limit,
      where: { restaurant: { id: rest.id } },
      order: { name: 'ASC' },
    });

    if (!usuarios) {
      throw new NotFoundException('❌ No users found');
    }

    //const usuariosSinClave = usuarios.map(({ password, ...resto }) => resto);

    return { page, limit, usuarios: usuarios };
  }

  async findAuthId(payload) {
    return;
  }
  //   // Finalizado GEA Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  //   async createUser(userToCreate, rest): Promise<Omit<User, 'password'>> {
  //     const hash = await this.bcryptService.hash(userToCreate.password);
  //     if (!hash) {
  //       throw new InternalServerErrorException('Problem with the bcrypt library');
  //     }

  //     const newUser = { ...userToCreate, password: hash };
  //     newUser.restaurant = rest;
  //     this.userRepository.create(newUser);
  //     const usuarioCreado = await this.userRepository.save(newUser);
  //     const { password, ...userSinPass } = usuarioCreado;
  //     return userSinPass;
  //   }

  //   // Finalizado GEA Mayo-13---- trabajando en este endpoint ---GEA Mayo 12-
  //   async getUserByEmail(email: string): Promise<User | null> {
  //     const usuario = await this.userRepository.findOne({
  //       where: { email },
  //       relations: ['restaurant'],
  //     });

  //     return usuario;
  //   }

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

  //   async findAuthId(sub) {
  //     const customer = await this.customerRepository.findOne({
  //       where: { auth0Id: sub },
  //     });

  //     if (customer) return customer;
  //     return false;
  //   }
  // }
}
