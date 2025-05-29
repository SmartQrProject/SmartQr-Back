import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantsService } from '../restaurants/restaurants.service';

@Injectable()
export class RestaurantTableRepository {
  constructor(
    @InjectRepository(RestaurantTable)
    private readonly restaurantTableRepository: Repository<RestaurantTable>,
    private readonly restService: RestaurantsService,
  ) {}

  // GEA FINALIZADO Mayo 16 -------------------------------------------------
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
      throw new NotFoundException(`❌ No Tables found for this restaurant ${rest}`);
    }

    return { page, limit, restaurantTables: tables };
  }

  // GEA FINALIZADO Mayo 16 -------------------------------------------------
  async seeder(slug, qty, prefix) {
    const rest = await this.restService.getRestaurants(slug);
    const cant = Number(qty);

    const items = Array.from({ length: cant }, (_, i) => ({
      code: prefix + `-${(i + 1).toString().padStart(2, '0')}`,
      restaurant: rest,
    }));

    const tablesArray = await this.restaurantTableRepository.createQueryBuilder().insert().into(RestaurantTable).values(items).orIgnore().execute();

    return items;
  }

  // GEA FINALIZADO Mayo 16 -------------------------------------------------
  async findOneById(rest, id): Promise<RestaurantTable> {
    const restTable = await this.restaurantTableRepository.findOne({
      where: { restaurant: { id: rest.id }, id: id },
      relations: ['restaurant'],
    });

    if (!restTable) {
      throw new NotFoundException(`❌ No Table found for this restaurant ${rest} and with this Id: ${id}`);
    }

    return restTable;
  }

  // GEA FINALIZADO Mayo 16 -------------------------------------------------
  async deleteById(rest, id): Promise<RestaurantTable> {
    const restTable = await this.restaurantTableRepository.findOne({
      where: { restaurant: { id: rest.id }, id: id, exist: true },
      relations: ['restaurant'],
    });

    if (!restTable) {
      throw new NotFoundException(`❌ No Table found for this restaurant ${rest} and with this Id: ${id}`);
    }
    const updatedTable = this.restaurantTableRepository.merge(restTable, {
      exist: false,
      is_active: false,
    });
    await this.restaurantTableRepository.save(updatedTable);
    return updatedTable;
  }
  // GEA FINALIZADO Mayo 17 -------------------------------------------------
  async updateById(rest, id, updateRestaurantTable: Partial<UpdateRestaurantTableDto>): Promise<RestaurantTable> {
    const restTable = await this.restaurantTableRepository.findOne({
      where: { restaurant: { id: rest.id }, id: id },
      relations: ['restaurant'],
    });

    if (!restTable) {
      throw new NotFoundException(`❌ No Table found for this restaurant ${rest} and with this Id: ${id}`);
    }
    const updatedTable = this.restaurantTableRepository.merge(restTable, updateRestaurantTable);
    await this.restaurantTableRepository.save(updatedTable);
    return updatedTable;
  }
}
