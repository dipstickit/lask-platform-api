import { Module } from '@nestjs/common';
import { ProductsPhotoService } from './products-photo.service';
import { ProductsPhotoController } from './products-photo.controller';

@Module({
  controllers: [ProductsPhotoController],
  providers: [ProductsPhotoService],
})
export class ProductsPhotoModule {}
