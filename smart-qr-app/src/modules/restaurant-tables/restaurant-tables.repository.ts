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
    private readonly userRepository: Repository<RestaurantTable>,
  ) {}
}
