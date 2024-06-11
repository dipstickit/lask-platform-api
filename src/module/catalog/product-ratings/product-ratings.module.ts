import { Module } from '@nestjs/common';
import { ProductRatingsService } from './product-ratings.service';
import { ProductRatingsController } from './product-ratings.controller';
import { ProductRatingPhotosModule } from './product-rating-photos/product-rating-photos.module';

@Module({
  controllers: [ProductRatingsController],
  providers: [ProductRatingsService],
  imports: [ProductRatingPhotosModule],
})
export class ProductRatingsModule {}
