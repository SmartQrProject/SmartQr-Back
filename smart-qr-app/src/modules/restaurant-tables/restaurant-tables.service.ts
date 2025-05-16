import { Injectable } from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} restaurantTable`;
  }

  update(id: number, updateRestaurantTableDto: UpdateRestaurantTableDto) {
    return `This action updates a #${id} restaurantTable`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaurantTable`;
  }
}
