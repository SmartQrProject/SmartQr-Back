import { Injectable } from '@nestjs/common';
import { CloudinaryRepository } from './cloudinary.repository';
//import { ProductsRepository } from '../products/Products.repository';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly cloudinaryRepository: CloudinaryRepository,
    //private readonly productRepository: ProductsRepository,
  ) {}

  async updateImg(file: Express.Multer.File) /*: Promise<string>*/ {
    //buscar producto primero

    const imgUrl: string = await this.cloudinaryRepository.updateImg(file);
    /////////////////////////////////////////////////////////////////////////////////////////chequear

    return imgUrl;
    // return await this.productRepository.updateProduct(id, { imgUrl });
  }

  async updateImgBanner(file: Express.Multer.File) /*: Promise<string>*/ {
    //buscar producto primero

    const imgUrl: string = await this.cloudinaryRepository.updateImg(file);
    /////////////////////////////////////////////////////////////////////////////////////////chequear

    return imgUrl;
    // return await this.productRepository.updateProduct(id, { imgUrl });GUARDAR URL EN LA BASE DE DATOS EN EL CAMPO BANER DEL RESTO POR SLUG
  }
}
