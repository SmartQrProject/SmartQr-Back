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
import { tablesCargaInicial } from 'src/gea-no-copiar/restauranttables';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class RestaurantTableRepository {
  constructor(
    @InjectRepository(RestaurantTable)
    private readonly restaurantTableRepository: Repository<RestaurantTable>,
    private readonly restService: RestaurantsService,
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
    const [tables, total] = await this.restaurantTableRepository.findAndCount({
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

  async seeder() {
    const rest = await this.restService.getRestaurants('test-cafe');
    const registros = tablesCargaInicial.map((table) => ({
      code: table.code,
      restaurant: rest,
    }));

    console.log(`Cantidad de registros:`, registros.length);
    console.log(registros);

    await this.restaurantTableRepository
      .createQueryBuilder()
      .insert()
      .into(RestaurantTable)
      .values(registros)
      .orIgnore()
      .execute();

    return;
  }
}
