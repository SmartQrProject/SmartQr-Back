import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRestaurantTableDto } from './dto/create-restaurant-table.dto';
import { UpdateRestaurantTableDto } from './dto/update-restaurant-table.dto';
import { RestaurantTable } from 'src/shared/entities/restaurant-table.entity';
import { RestaurantTableRepository } from './restaurant-tables.repository';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { MailService } from 'src/common/services/mail.service';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantTablesService {
  constructor(
    private readonly restaurantTableRepository: RestaurantTableRepository,
    private readonly restService: RestaurantsService,
    private readonly mailService: MailService,
  ) {}

  async findAll(
    slug,
    page,
    limit,
    req,
  ): Promise<{
    page: number;
    limit: number;
    restaurantTables: RestaurantTable[];
  }> {
    const rest = await this.restService.getRestaurants(slug);
    //solo pueden visualizar superadmin cualquier categoria
    //y el owner y el staff las mesas de su propio restaurant.
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner') || req.user.roles.includes('staff')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can visualize Tables from other restaurants.`);
        }
      }
    }
    return this.restaurantTableRepository.findAll(rest, page, limit);
  }

  //====================================================================
  async seeder(slug, qty, prefix, req) {
    const rest = await this.restService.getRestaurants(slug);

    const cant = Number(qty);
    if (cant >= 99) {
      throw new BadRequestException(`❌ The number of tables shoud be less than 100 for this restaurant `);
    }

    //solo pueden visualizar superadmin cualquier categoria
    //y el owner y el staff las mesas de su propio restaurant.
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can NOT create  Tables for other restaurants.`);
        }
      }
    }

    const tables = await this.restaurantTableRepository.seeder(rest, qty, prefix);

    return tables;
  }

  //====================================================================
  async findOneById(slug, id, req): Promise<RestaurantTable> {
    const rest = await this.restService.getRestaurants(slug);
    //solo pueden visualizar superadmin cualquier categoria
    //y el owner y el staff las mesas de su propio restaurant.
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner') || req.user.roles.includes('staff')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can visualize Tables from other restaurants.`);
        }
      }
    }
    return this.restaurantTableRepository.findOneById(rest, id);
  }

  //====================================================================
  async deleteById(slug, id, req): Promise<RestaurantTable> {
    const rest = await this.restService.getRestaurants(slug);
    //solo pueden borrar superadmin cualquier categoria
    //y el owner las mesas de su propio restaurant.
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can NOT visualize Tables from other restaurants.`);
        }
      }
    }
    const mesaBorrada = await this.restaurantTableRepository.deleteById(rest, id);
    await this.sendEmail(rest, mesaBorrada, 'deleted'); //nodemailer
    return mesaBorrada;
  }
  //====================================================================

  async update(slug, id, updateRestaurantTable, req) {
    const rest = await this.restService.getRestaurants(slug);
    //solo pueden modificar superadmin cualquier categoria
    //y el owner las mesas de su propio restaurant.
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner') || req.user.roles.includes('staff')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can NOT visualize Tables from other restaurants.`);
        }
      }
    }

    const updatedTable = await this.restaurantTableRepository.updateById(rest, id, updateRestaurantTable);
    await this.sendEmail(rest, updatedTable, 'updated'); //nodemailer
    return updatedTable;
  }

  async sendEmail(rest, restaurantTable, accion) {
    const subject = `The restaurant Table ${restaurantTable.code} was ${accion} successfully. `;
    const textmsg = `Hello ${rest.owner_email},  A Table for your restaurant have been ${accion}.
      Restaurant Name: ${rest.name} 
      Table name: ${restaurantTable.code}
      Table Active: ${restaurantTable.is_active}
      Table Status: ${restaurantTable.exist} `;
    const htmlTemplate = 'basico';
    await this.mailService.sendMail(rest.owner_email, subject, textmsg, htmlTemplate);
  }
}
