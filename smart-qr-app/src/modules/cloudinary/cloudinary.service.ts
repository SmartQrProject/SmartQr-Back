import { Injectable } from '@nestjs/common';
import { CloudinaryRepository } from './cloudinary.repository';
//import { ProductsRepository } from '../products/Products.repository';

@Injectable()
export class CloudinaryService {
  constructor(
    private readonly cloudinaryRepository: CloudinaryRepository,
    //private readonly productRepository: ProductsRepository,
  ) {}

  async updateImg(id: string, file: Express.Multer.File) /*: Promise<string>*/ {
    //buscar producto primero

    const imgUrl: string = await this.cloudinaryRepository.updateImg(file);
    /////////////////////////////////////////////////////////////////////////////////////////chequear

    return imgUrl;
    // return await this.productRepository.updateProduct(id, { imgUrl });
  }
}
