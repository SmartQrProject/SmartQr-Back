import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesRepository } from './categories.repository';
import { Category } from '../../shared/entities/category.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), RestaurantsModule, CommonModule],
  controllers: [CategoriesController],
  providers: [CategoriesService, CategoriesRepository, MailService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
