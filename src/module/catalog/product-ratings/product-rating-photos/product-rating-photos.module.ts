import { Module } from '@nestjs/common';
import { ProductRatingPhotosService } from './product-rating-photos.service';
import { ProductRatingPhotosController } from './product-rating-photos.controller';

@Module({
  controllers: [ProductRatingPhotosController],
  providers: [ProductRatingPhotosService],
})
export class ProductRatingPhotosModule {}
