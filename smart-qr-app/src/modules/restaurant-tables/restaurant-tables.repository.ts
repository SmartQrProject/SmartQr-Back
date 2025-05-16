import {
  Injectable,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';

@Injectable()
export class RestaurantTableRepository {
  constructor(
    @InjectRepository(RestaurantTable)
    private readonly restaurantRepository: Repository<RestaurantTable>,
  ) {}

  // GEA FINALIZADO Mayo 16
  async findAll(
    rest,
    page: number,
    limit: number,
  ): Promise<{
    page: number;
    limit: number;
    restaurantTables: RestaurantTable[];
  }> {
    const skip = (page - 1) * limit;
    const [tables, total] = await this.restaurantRepository.findAndCount({
      skip,
      take: limit,
      where: { restaurant: { id: rest.id } },
      order: { code: 'ASC' },
    });

    if (!tables) {
      throw new NotFoundException(
        `❌ No Tables found for this restaurant ${rest}`,
      );
    }

    return { page, limit, restaurantTables: tables };
  }
}
