import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/shared/entities/user.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { UsersRepository } from './users.repository';
import { SignInUserDto } from './dto/signIn-user.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly restService: RestaurantsService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  // FINALIZDO GEA MAYO-13------ trabajando en este endpoint ---GEA Mayo 12-
  async userLogin(
    /*slug,*/ { email, password }: SignInUserDto,
  ): Promise<object> {
    /*const rest = await this.restService.getRestaurants(slug);*/
    const user = await this.usersRepository.getUserByEmail(email);

    if (
      !user ||
      !user.exist ||
      /*!rest ||
      user.restaurant.id !== rest.id ||*/
      !(await this.bcryptService.compare(password, user.password))
    ) {
      throw new UnauthorizedException('Not valid Credentials');
    }

    const jwtPayLoad = {
      sub: user.id,
      id: user.id,
      email: user.email,
      roles: user.role,
    };

    const access_token = this.jwtService.generateToken(jwtPayLoad);
    return { success: 'Logged Succesfully with token', access_token };
  }

  // FINALIZDO GEA MAYO-13------ trabajando en este endpoint ---GEA Mayo 12-
  async modifyUserById(id, slug, user, req): Promise<string> {
    const rest = await this.restService.getRestaurants(slug);
    if (user.password !== user.confirmPassword) {
      throw new ConflictException('Passwords are not equals!!!');
    }
    return this.usersRepository.putById(id, rest, user, req);
  }

  // FINALIZDO GEA MAYO-13------ trabajando en este endpoint ---GEA Mayo 12-
  async deleteUserById(id, slug, req): Promise<string> {
    const rest = await this.restService.getRestaurants(slug);
    return this.usersRepository.deleteById(id, rest, req);
  }

  // FINALIZDO GEA MAYO-13------ trabajando en este endpoint ---GEA Mayo 12-
  async getUsers(
    slug,
    page,
    limit,
  ): Promise<{
    page: number;
    limit: number;
    usuarios: Omit<User, 'password'>[];
  }> {
    const rest = await this.restService.getRestaurants(slug);
    console.log('rest.id: -----------------> ', rest.id);
    return this.usersRepository.getUsers(rest, page, limit);
  }

  // Finalizado Mayo-13------ trabajando en este endpoint ---GEA Mayo 12-
  async userSignUp(slug, newUser): Promise<Omit<User, 'password'>> {
    const rest = await this.restService.getRestaurants(slug);
    const user = await this.usersRepository.getUserByEmail(newUser.email);
    if (user) {
      throw new ConflictException(`❌ User ${newUser.email} already exists!!`);
    }

    if (newUser.password !== newUser.confirmPassword) {
      throw new ConflictException('❌ Passwords are not equals!!!');
    }

    console.log('nuevo usuario: ', newUser, ' restaurant: ', rest);
    return await this.usersRepository.createUser(newUser, rest);
  }
}
