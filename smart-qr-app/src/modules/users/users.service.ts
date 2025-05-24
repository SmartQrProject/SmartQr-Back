import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/shared/entities/user.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { UsersRepository } from './users.repository';
import { SignInUserDto } from './dto/signIn-user.dto';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { JwtService } from 'src/common/services/jwt.service';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly restService: RestaurantsService,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async userLogin(/*slug,*/ { email, password }: SignInUserDto): Promise<object> {
    /*const rest = await this.restService.getRestaurants(slug);*/
    const user = await this.usersRepository.getUserByEmail(email);

    if (
      !user ||
      !user.exist ||
      !user.is_active ||
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
      slug: user.restaurant.slug,
      restaurant: user.restaurant,
    };

    const access_token = this.jwtService.generateToken(jwtPayLoad);

    return { success: 'Logged Succesfully with token', access_token };
  }

  async modifyUserById(id, slug, user, req): Promise<User> {
    const usuario = await this.usersRepository.getUserById(id);

    if (!usuario || !usuario.exist) {
      throw new NotFoundException(`❌ No users found  with id ${id} or is blocked !!`);
    }

    const rest: Restaurant = await this.restService.getRestaurants(slug);
    if (!rest) {
      throw new NotFoundException(`❌ restaurant ${slug} found !!`);
    }

    if (usuario && usuario.restaurant.id !== rest.id) {
      throw new NotFoundException(`❌ No users found  with id ${id} for the restaurant ${rest.id} or is blocked !!`);
    }

    if (user.email) {
      const usuario = await this.usersRepository.getUserByEmail(user.email);
      if (usuario && usuario.id !== id) {
        throw new ConflictException(`❌ Email already in use: ${user.email} !!`);
      }
    }

    if (user.password && user.password !== user.confirmPassword) {
      throw new ConflictException('Passwords are not equals!!!');
    }

    if (!req.user.roles.includes('superAdmin')) {
      if (!req.user.roles.includes('owner')) {
        if (req.user.id !== id) {
          throw new NotFoundException(`You can not update this User data .`);
        }
      }
    }

    const updatedUser = this.usersRepository.patchById(id, rest, user, req);
    this.sendEmail(rest, usuario, 'updated'); //nodemailer
    return updatedUser;
  }

  async deleteUserById(id, slug, req): Promise<User> {
    const usuario = await this.usersRepository.getUserById(id);

    if (!usuario || !usuario.exist) {
      throw new NotFoundException(`❌ No users found  with id ${id} or is blocked !!`);
    }

    const rest = await this.restService.getRestaurants(slug);
    if (!rest) {
      throw new NotFoundException(`❌ restaurant ${slug} found !!`);
    }

    if (usuario && usuario.restaurant.id !== rest.id) {
      throw new NotFoundException(`❌ No users found  with id ${id} for the restaurant ${rest.id} or is blocked !!`);
    }

    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can not in-activate this User .`);
        }
      } else {
        throw new NotFoundException(`You can not in-activate this User .`);
      }
    }

    const userDeleted = this.usersRepository.deleteById(id);
    this.sendEmail(rest, usuario, 'deleted'); //nodemailer
    return userDeleted;
  }

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

  async getActiveStaff(
    slug,
    page,
    limit,
  ): Promise<{
    page: number;
    limit: number;
    usuarios: Omit<User, 'password'>[];
  }> {
    const rest = await this.restService.getRestaurants(slug);
    return this.usersRepository.getActiveStaff(rest, page, limit);
  }

  async userSignUp(slug, newUser): Promise<Omit<User, 'password'>> {
    const rest = await this.restService.getRestaurants(slug);
    const user = await this.usersRepository.getUserByEmail(newUser.email);

    if (user) {
      throw new ConflictException(`❌ User ${newUser.email} already exists!!`);
    }

    if (newUser.password !== newUser.confirmPassword) {
      throw new ConflictException('❌ Passwords are not equals!!!');
    }

    const userCreated = await this.usersRepository.createUser(rest, newUser);
    this.sendEmail(rest, userCreated, 'created'); //nodemailer
    return userCreated;
  }

  async sendEmail(rest, user, accion) {
    const subject = `The user ${user.name} was ${accion} successfully. `;
    const textmsg = `Hello ${rest.owner_email},  A user for your restaurant have been ${accion}.
    
      Restaurant Name: ${rest.name} 
      User:  ${user.name} -  ${user.email} `;
    const htmlTemplate = 'basico';
    await this.mailService.sendMail(rest.owner_email, subject, textmsg, htmlTemplate);
  }
}
