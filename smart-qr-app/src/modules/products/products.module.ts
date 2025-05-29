import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { Product } from '../../shared/entities/product.entity';
import { Category } from '../../shared/entities/category.entity';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { CommonModule } from 'src/common/common.module';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category]), RestaurantsModule, CommonModule],
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, MailService],
  exports: [ProductsService],
})
export class ProductsModule {}
