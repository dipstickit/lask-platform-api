import { Injectable } from '@nestjs/common';
import { CreateProductsPhotoDto } from './dto/create-products-photo.dto';
import { UpdateProductsPhotoDto } from './dto/update-products-photo.dto';

@Injectable()
export class ProductsPhotoService {
  create(createProductsPhotoDto: CreateProductsPhotoDto) {
    return 'This action adds a new productsPhoto';
  }

  findAll() {
    return `This action returns all productsPhoto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsPhoto`;
  }

  update(id: number, updateProductsPhotoDto: UpdateProductsPhotoDto) {
    return `This action updates a #${id} productsPhoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} productsPhoto`;
  }
}
