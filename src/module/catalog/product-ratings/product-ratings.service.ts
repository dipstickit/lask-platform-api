import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProductRating } from './models/product-rating.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRatingDto } from './dto/product-rating.dto';
import { NotFoundError } from '../../errors/not-found.error';
import { User } from '../../users/models/user.entity';
import { SettingsService } from '../../settings/settings.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class ProductRatingsService {
  constructor(
    @InjectRepository(ProductRating)
    private readonly productRatingsRepository: Repository<ProductRating>,
    private readonly productsService: ProductsService,
    private readonly settingsService: SettingsService,
  ) {}

  async getProductRatings(productId: number): Promise<ProductRating[]> {
    const ratings = await this.productRatingsRepository.find({
      where: { product: { id: productId } },
      relations: ['user'],
    });

    if (
      (await this.settingsService.getSettingValueByName(
        'Product rating photos',
      )) !== 'true'
    ) {
      ratings.forEach((rating) => (rating.photos = []));
    }

    return ratings;
  }

  async getProductRating(
    id: number,
    productId: number,
  ): Promise<ProductRating> {
    const rating = await this.productRatingsRepository.findOne({
      where: { id, product: { id: productId } },
    });

    if (!rating) {
      throw new NotFoundError('product rating');
    }

    return rating;
  }

  async createProductRating(
    user: User,
    productId: number,
    createData: ProductRatingDto,
  ): Promise<ProductRating> {
    const product = await this.productsService.getProduct(productId);
    const newRating = this.productRatingsRepository.create({
      user,
      product,
      rating: createData.rating,
      comment: createData.comment,
    });

    return this.productRatingsRepository.save(newRating);
  }

  async checkProductRatingUser(id: number, userId: number): Promise<boolean> {
    const rating = await this.productRatingsRepository.findOne({
      where: { id, user: { id: userId } },
    });

    return !!rating;
  }

  async updateProductRating(
    productId: number,
    id: number,
    updateData: ProductRatingDto,
  ): Promise<ProductRating> {
    const rating = await this.getProductRating(id, productId);
    Object.assign(rating, updateData);

    return this.productRatingsRepository.save(rating);
  }

  async deleteProductRating(productId: number, id: number): Promise<boolean> {
    await this.getProductRating(id, productId);
    await this.productRatingsRepository.delete({
      id,
      product: { id: productId },
    });

    return true;
  }
}
