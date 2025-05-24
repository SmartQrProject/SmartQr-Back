import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesRepository } from './categories.repository';
import { Category } from '../../shared/entities/category.entity';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { SequenceUpdateException } from '../../common/exceptions/sequence-update.exception';
import { MailService } from 'src/common/services/mail.service';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,
    private readonly restService: RestaurantsService,
    private readonly mailService: MailService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto, slug: string, req): Promise<Category> {
    const rest = await this.restService.getRestaurants(slug);
    //solo pueden crear superadmin cualquier categoria
    //y el owner .
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can not update categories from other restaurant.`);
        }
      }
    }
    const category = await this.categoriesRepository.createCategory(createCategoryDto, rest.id);
    this.sendEmail(rest, category, 'added'); //nodemailer
    return category;
  }

  async findAll(slug: string, page: number = 1, limit: number = 10): Promise<{ categories: Category[]; total: number; page: number; limit: number }> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.categoriesRepository.findAllByRestaurant(rest.id, page, limit);
  }

  async findOne(id: string, slug: string): Promise<Category> {
    const rest = await this.restService.getRestaurants(slug);
    return await this.categoriesRepository.findOneByIdAndRestaurant(id, rest.id);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto, slug: string, req): Promise<Category> {
    const rest = await this.restService.getRestaurants(slug);

    //solo pueden modidicar superadmin cualquier categoria
    //sino solo el owner de las categorias de su restaurant.
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can not update categories from other restaurant.`);
        }
      }
    }

    const category = await this.categoriesRepository.updateCategory(id, updateCategoryDto, rest.id);
    this.sendEmail(rest, category, 'createded'); //nodemailer
    return category;
  }

  async remove(id: string, slug: string, req): Promise<{ message: string }> {
    const rest = await this.restService.getRestaurants(slug);
    const category = await this.categoriesRepository.findOneByIdAndRestaurant(id, rest.id);
    //solo pueden eliminar superadmin cualquier categoria
    // y el owner del restaurant
    if (!req.user.roles.includes('superAdmin')) {
      if (req.user.roles.includes('owner')) {
        if (req.user.restaurant.id !== rest.id) {
          throw new NotFoundException(`You can not update categories from other restaurant.`);
        }
      }
    }
    await this.categoriesRepository.softDeleteCategory(id, rest.id);
    this.sendEmail(rest, category, 'un-activated'); //nodemailer
    return { message: `Category ${category.name} has been deleted successfully` };
  }

  async updateSequences(categories: { id: string; sequenceNumber: number }[], slug: string): Promise<{ message: string }> {
    try {
      const rest = await this.restService.getRestaurants(slug);
      await this.categoriesRepository.updateCategorySequences(categories, rest.id);
      return { message: 'Category sequences have been updated successfully' };
    } catch (error) {
      if (error instanceof SequenceUpdateException) {
        throw error;
      }
      throw new SequenceUpdateException('Failed to update category sequences. Please ensure all category IDs are valid and try again.');
    }
  }

  async sendEmail(rest, category, accion) {
    const subject = `The category ${category.name} was ${accion} successfully. `;
    const textmsg = `Hello ${rest.owner_email},  A category for your products have been ${accion}.\n 
      Restaurant Name: ${rest.name} 
      Category:  ${category.name} 
                 ${category.secuenceNumber} `;
    const htmlTemplate = 'basico';
    await this.mailService.sendMail(rest.owner_email, subject, textmsg, htmlTemplate);
  }
}
