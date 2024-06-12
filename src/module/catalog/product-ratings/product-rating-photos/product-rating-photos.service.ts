import { Injectable } from '@nestjs/common';
import { CreateProductRatingPhotoDto } from './dto/create-product-rating-photo.dto';
import { UpdateProductRatingPhotoDto } from './dto/update-product-rating-photo.dto';

@Injectable()
export class ProductRatingPhotosService {
  create(createProductRatingPhotoDto: CreateProductRatingPhotoDto) {
    return 'This action adds a new productRatingPhoto';
  }

  findAll() {
    return `This action returns all productRatingPhotos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productRatingPhoto`;
  }

  update(id: number, updateProductRatingPhotoDto: UpdateProductRatingPhotoDto) {
    return `This action updates a #${id} productRatingPhoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} productRatingPhoto`;
  }
}
