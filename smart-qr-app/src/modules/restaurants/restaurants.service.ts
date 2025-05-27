import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CreateRestaurantsDto } from './dto/create-restaurants.dto';
import { User } from 'src/shared/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { Restaurant } from 'src/shared/entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BcryptService } from 'src/common/services/bcrypt.service';
import { MailService } from 'src/common/services/mail.service';
import { StripeService } from '../stripe/stripe.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly bcryptService: BcryptService,
    private dataSource: DataSource,
    private mailService: MailService,
    @Inject() private readonly stripeService: StripeService,
  ) {}

  async createRestaurants(dto: CreateRestaurantsDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const sanitizedSlug = dto.slug.replace(/[^a-zA-Z0-9-]/g, '').toLowerCase();

      // Validar slug único
      const slugExists = await queryRunner.manager.findOneBy(Restaurant, {
        slug: sanitizedSlug,
      });
      if (slugExists) {
        throw new BadRequestException('Restaurant already Registered');
      }

      // Validar email único
      const emailExists = await queryRunner.manager.findOneBy(User, {
        email: dto.owner_email,
      });
      if (emailExists) {
        throw new BadRequestException(`Email User alread exists ${dto.owner_email}`);
      }

      const newRestaurants = await queryRunner.manager.save(
        queryRunner.manager.create(Restaurant, {
          name: dto.name,
          slug: sanitizedSlug,
          owner_email: dto.owner_email,
        }),
      );

      const newUser = await queryRunner.manager.save(
        queryRunner.manager.create(User, {
          email: dto.owner_email,
          password: await this.bcryptService.hash(dto.owner_pass),
          role: 'owner',
          name: 'owner ' + dto.name,
          restaurant: newRestaurants,
        }),
      );
      const stripe = await this.stripeService.createSubscriptionSession(newRestaurants.slug);
      await queryRunner.commitTransaction();

      //nodemailer
      const subject = `Restaurant and Owner User was successfully created ${newRestaurants.name}`;
      const textmsg = `Hello ${newUser.name},  Your Restaurant have been updated and your profile have been created.\n 
      Usuario: ${newUser.email} 
      Password: ${newUser.password}`;
      const htmlTemplate = 'basico';
      this.mailService.sendMail(newUser.email, subject, textmsg, htmlTemplate);

      return { url: stripe.url };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getRestaurants(slug: string) {
    const restaurantsBySlug: Restaurant | null = await this.restaurantRepository.findOne({
      where: {
        slug,
        exist: true,
        is_active: true,
      },
      relations: {
        categories: {
          products: true,
        },
      },
    });
    if (!restaurantsBySlug) throw new NotFoundException(`Restaurant with slug ${slug} not found`);
    return restaurantsBySlug;
  }
  async getRestaurantsPublic(slug: string) {
    const restaurant = await this.restaurantRepository.findOne({
      where: {
        slug,
        exist: true,
        is_active: true,
      },
      relations: {
        categories: {
          products: true,
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException(`Restaurant with slug ${slug} not found`);
    }

    const result = {
      name: restaurant.name,
      slug: restaurant.slug,
      is_active: restaurant.is_active,
      banner: restaurant.banner,
      address: restaurant.address,
      phone: restaurant.phone,
      description: restaurant.description,
      tags: restaurant.tags,
      trading_hours: restaurant.trading_hours,
      ordering_times: restaurant.ordering_times,
      categories: restaurant.categories
        .filter((c) => c.exist)
        .map((category) => ({
          name: category.name,
          sequenceNumber: category.sequenceNumber,
          products: category.products
            .filter((p) => p.exist)
            .map((product) => ({
              sequenceNumber: product.sequenceNumber,
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              image_url: product.image_url,
              is_available: product.is_available,
              details: product.details,
            })),
        })),
    };

    return result;
  }

  async patchRestaurantBySlug(slug, restaurantData, req): Promise<string> {
    // Validar slug único
    const slugExists = await this.restaurantRepository.findOneBy({ slug });

    if (!slugExists || !slugExists.exist) {
      throw new BadRequestException(`Restaurant NOT Registered with this slug ${slug}`);
    }

    if (!req.user.roles.includes('superAdmin')) {
      if (!req.user.roles.includes('owner')) {
        throw new NotFoundException(`You can not update data for this restaurant ${slug}.`);
      } else if (req.user.email !== slugExists.owner_email) {
        throw new NotFoundException(`You can not update data for this restaurant ${slug}.`);
      }
    }

    const mergedRest = this.restaurantRepository.merge(slugExists, restaurantData);
    await this.restaurantRepository.save(mergedRest);

    //nodemailer
    const subject = `Restaurant data was successfully updated ${mergedRest.name}`;
    const textmsg = `Hello ${mergedRest.owner_email},  Your Restaurant profile have been updated.\n 
    Restaurant Name: ${mergedRest.name} `;
    const htmlTemplate = 'basico';
    this.mailService.sendMail(mergedRest.owner_email, subject, textmsg, htmlTemplate);

    return `Restaurante ${slug} data were updated.`;
  }

  @OnEvent('restaurant.paid')
  async activatePlan(slug: string) {
    const result = await this.restaurantRepository.update({ slug }, { is_active: true });

    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with slug ${slug} not found`);
    }
  }

  async deactivatePlan(slug: string) {
    const result = await this.restaurantRepository.update({ slug }, { is_active: false });

    if (result.affected === 0) {
      throw new NotFoundException(`Restaurant with slug ${slug} not found`);
    }
  }

  getAllRestaurants() {
    return this.restaurantRepository.find({
      where: { exist: true },
    });
  }

  async deleteRestaurantBySlug(slug, req): Promise<string> {
    const slugExists = await this.restaurantRepository.findOneBy({ slug });

    if (!slugExists || !slugExists.exist) {
      throw new BadRequestException(`Restaurant NOT Registered with this slug ${slug}`);
    }

    if (!req.user.roles.includes('superAdmin')) {
      if (!req.user.roles.includes('owner')) {
        throw new NotFoundException(`You can not update data for this restaurant ${slug}.`);
      } else if (req.user.email !== slugExists.owner_email) {
        throw new NotFoundException(`You can not update data for this restaurant ${slug}.`);
      }
    }

    const updatedRestaurant = { is_active: false, exist: false };
    const mergedRest = this.restaurantRepository.merge(slugExists, updatedRestaurant);
    await this.restaurantRepository.save(mergedRest);

    //nodemailer
    const subject = `Restaurant data was successfully deleted ${mergedRest.name}`;
    const textmsg = `Hello ${mergedRest.owner_email},  Your Restaurant profile have been updated.\n 
    Restaurant Name: ${mergedRest.name} `;
    const htmlTemplate = 'basico';
    this.mailService.sendMail(mergedRest.owner_email, subject, textmsg, htmlTemplate);

    return `Restaurante ${slug} data was deleted.`;
  }
}
