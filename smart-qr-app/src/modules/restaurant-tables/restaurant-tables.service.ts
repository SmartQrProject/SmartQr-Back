import { Injectable } from '@nestjs/common';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';

@Injectable()
export class RestaurantTablesService {
  create(createRestaurantTableDto: CreateRestaurantTableDto) {
    return 'This action adds a new restaurantTable';
  }

  findAll() {
    return `This action returns all restaurantTables`;
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
