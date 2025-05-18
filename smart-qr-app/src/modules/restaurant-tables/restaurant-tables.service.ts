import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { RestaurantTableRepository } from './restaurant-tables.repository';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class RestaurantTablesService {
  constructor(
    private readonly restTableRepository: RestaurantTableRepository,
    private readonly restService: RestaurantsService,
  ) {}

  create(createRestaurantTableDto: CreateRestaurantTableDto) {
    return 'This action adds a new restaurantTable';
  }

  async findAll(
    slug,
    page,
    limit,
  ): Promise<{
    page: number;
    limit: number;
    restaurantTables: RestaurantTable[];
  }> {
    const rest = await this.restService.getRestaurants(slug);
    return this.restTableRepository.findAll(rest, page, limit);
  }

  //====================================================================
  seeder(slug, qty, prefix) {
    console.log('=============================================');
    console.log(slug, qty, prefix);
    const cant = Number(qty);
    if (cant >= 99) {
      throw new BadRequestException(
        `❌ The number of tables shoud be less than 100 for this restaurant `,
      );
    }
    return this.restTableRepository.seeder(slug, qty, prefix);
  }

  //====================================================================
  async findOneById(slug, id): Promise<RestaurantTable> {
    const rest = await this.restService.getRestaurants(slug);
    return this.restTableRepository.findOneById(rest, id);
  }

  //====================================================================
  async deleteById(slug, id) {
    const rest = await this.restService.getRestaurants(slug);
    return this.restTableRepository.deleteById(rest, id);
  }
  //====================================================================

  async update(slug, id, updateRestaurantTable) {
    const rest = await this.restService.getRestaurants(slug);
    return this.restTableRepository.updateById(rest, id, updateRestaurantTable);
  }
}
