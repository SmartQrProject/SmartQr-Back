import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryRepository } from './cloudinary.repository';
import { cloudinaryConfig } from 'src/config/cloudinary';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/shared/entities/product.entity';
import { ProductsModule } from '../products/products.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  providers: [CloudinaryService, CloudinaryRepository, cloudinaryConfig],
  controllers: [CloudinaryController],
  imports: [TypeOrmModule.forFeature([Product]), ProductsModule, CommonModule],
})
export class CloudinaryModule {}
