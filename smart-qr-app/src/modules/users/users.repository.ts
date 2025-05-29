import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared/entities/user.entity';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { PutUserDto } from './dto/put-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async patchById(id: string, rest, updateUser: PutUserDto, req): Promise<User> {
    const user = await this.userRepository.findOneBy({
      id: id,
      restaurant: { id: rest.id },
    });

    if (!user || !user.exist) {
      throw new NotFoundException(`❌ No users found  with id ${id} for the restaurant ${rest.id} or is blocked !!`);
    }

    if (updateUser.password) {
      const hash = await this.bcryptService.hash(updateUser.password);
      if (!hash) {
        throw new InternalServerErrorException('Problem with the bcrypt library');
      }
      updateUser.password = hash;
    }

    const { confirmPassword, ...putUser } = updateUser;
    const mergeUser = this.userRepository.merge(user, putUser);
    const updatedUser = await this.userRepository.save(mergeUser);
    return updatedUser;
  }

  async deleteById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['restaurant'],
    });

    if (!user || !user.exist) {
      throw new NotFoundException(`❌ Usuer with id ${id}  is blocked!!!!`);
    }

    user.exist = false;
    user.is_active = false;
    const deletedUser = await this.userRepository.save(user);
    return deletedUser;
  }

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

  async getActiveStaff(
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
      where: {
        role: 'staff',
        exist: true,
        restaurant: { id: rest.id },
      },
      order: { name: 'ASC' },
    });

    if (!usuarios) {
      throw new NotFoundException('❌ No users found');
    }

    const usuariosSinClave = usuarios.map(({ password, ...resto }) => resto);

    return { page, limit, usuarios: usuariosSinClave };
  }

  // Finalizado GEA Mayo 13------ trabajando en este endpoint ---GEA Mayo 12-
  async createUser(rest, userToCreate): Promise<Omit<User, 'password'>> {
    const hash = await this.bcryptService.hash(userToCreate.password);
    if (!hash) {
      throw new InternalServerErrorException('Problem with the bcrypt library');
    }

    userToCreate.password = hash;
    userToCreate.restaurant = rest;
    const user2BeCreated = this.userRepository.create(userToCreate);
    await this.userRepository.save(user2BeCreated);
    const { password, ...userSinPass } = userToCreate;
    return userSinPass;
  }

  // Finalizado GEA Mayo-13---- trabajando en este endpoint ---GEA Mayo 12-
  async getUserByEmail(email: string): Promise<User | null> {
    const usuario = await this.userRepository.findOne({
      where: { email: email, exist: true },
      relations: ['restaurant'],
    });

    return usuario;
  }

  // Finalizado GEA Mayo-13---- trabajando en este endpoint ---GEA Mayo 12-
  async getUserById(id: string): Promise<User | null> {
    const usuario = await this.userRepository.findOne({
      where: { id: id, exist: true },
      relations: ['restaurant'],
    });

    return usuario;
  }
}
