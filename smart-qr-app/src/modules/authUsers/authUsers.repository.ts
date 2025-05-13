import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { PutUserDto } from '../users/dto/put-user.dto';

@Injectable()
export class AuthUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  // GEA FINALIZADO Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async putById(
    id: string,
    rest,
    updateUser: PutUserDto,
    req,
  ): Promise<string> {
    const user = await this.userRepository.findOneBy({
      id: id,
      restaurant: { id: rest.id },
    });

    console.log('=======================');
    console.log(user);
    console.log('=======================');

    if (!user) {
      throw new NotFoundException(
        `❌ No users found  with id ${id} for the restaurant ${rest.id} !!`,
      );
    }

    if (!req.user.roles.includes('superAdmin') && req.user.id !== id) {
      throw new NotFoundException(
        `You can not update User data for a different user.`,
      );
    }

    const usuario = await this.getUserByEmail(updateUser.email);
    if (usuario && usuario.id !== id) {
      throw new ConflictException(
        `❌ Email already in use: ${usuario.email} !!`,
      );
    }

    const hash = await this.bcryptService.hash(updateUser.password);
    if (!hash) {
      throw new InternalServerErrorException('Problem with the bcrypt library');
    }

    updateUser.password = hash;
    const { confirmPassword, ...putUser } = updateUser;
    const mergeUser = this.userRepository.merge(user, putUser);
    await this.userRepository.save(mergeUser);
    return id + ' was updated';
  }

  // GEA FINALIZADO Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async deleteById(id: string, rest, req): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!user || user.restaurant.id !== rest.id) {
      throw new NotFoundException(
        `❌ Usuer with id ${id} not found for this restaurant ${rest.name}!!!`,
      );
    }

    if (!req.user.roles.includes('superAdmin') && req.user.id !== id) {
      throw new NotFoundException(
        `You can not delete a User account of a different user.`,
      );
    }
    await this.userRepository.remove(user);
    return id;
  }

  // GEA FINALIZADO Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async getUsers(
    rest,
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    usuarios: Omit<User, 'password'>[];
  }> {
    const skip = (page - 1) * limit;
    const [usuarios, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      where: { restaurant: { id: rest.id } },
      order: { name: 'ASC' },
    });

    if (!usuarios) {
      throw new NotFoundException('❌ No users found');
    }

    const usuariosSinClave = usuarios.map(({ password, ...resto }) => resto);

    return { page, limit, usuarios: usuariosSinClave };
  }

  // Finalizado GEA Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async createUser(userToCreate, rest): Promise<Omit<User, 'password'>> {
    const hash = await this.bcryptService.hash(userToCreate.password);
    if (!hash) {
      throw new InternalServerErrorException('Problem with the bcrypt library');
    }

    const newUser = { ...userToCreate, password: hash };
    newUser.restaurant = rest;
    this.userRepository.create(newUser);
    const usuarioCreado = await this.userRepository.save(newUser);
    const { password, ...userSinPass } = usuarioCreado;
    return userSinPass;
  }

  // Finalizado GEA Mayo-13---- trabajando en este endpoint ---GEA Mayo 12-
  async getUserByEmail(email: string): Promise<User | null> {
    const usuario = await this.userRepository.findOne({
      where: { email },
      relations: ['restaurant'],
    });

    return usuario;
  }
}
