import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { User } from 'src/shared/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/common/services/bcrypt.service';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private dataSource: DataSource,
  ) {}

  async createRestaurants(dto: CreateRestaurantsDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sanitizedSlug = dto.slug
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase();
      if (
        await queryRunner.manager.findOneBy(Restaurant, { slug: sanitizedSlug })
      )
        throw new BadRequestException('Restaurants ya registrado');
      const newRestaurants: Restaurant = await queryRunner.manager.save(
        queryRunner.manager.create(Restaurant, {
          name: dto.name,
          slug: sanitizedSlug,
          owner_email: dto.owner_email,
        }),
      );
      const newUser: User = await queryRunner.manager.save(
        queryRunner.manager.create(User, {
          email: dto.owner_email,
          password: await this.bcryptService.hash(dto.owner_pass),
          role: 'owner',
          name: 'owner ' + dto.name,
          restaurant: newRestaurants,
        }),
      );

      await queryRunner.commitTransaction();

      return newRestaurants;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getRestaurants(slug: string) {
    const restaurantsBySlug: Restaurant | null =
      await this.restaurantRepository.findOne({
        where: { slug },
        relations: {
          categories: {
            products: true,
          },
        },
      });
    if (!restaurantsBySlug)
      throw new NotFoundException(`Restaurant con slug ${slug} no encontrado.`);
    return restaurantsBySlug;
  }
}
