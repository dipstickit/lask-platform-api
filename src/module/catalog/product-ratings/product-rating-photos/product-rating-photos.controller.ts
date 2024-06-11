import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductRatingPhotosService } from './product-rating-photos.service';
import { CreateProductRatingPhotoDto } from './dto/create-product-rating-photo.dto';
import { UpdateProductRatingPhotoDto } from './dto/update-product-rating-photo.dto';

@Controller('product-rating-photos')
export class ProductRatingPhotosController {
  constructor(private readonly productRatingPhotosService: ProductRatingPhotosService) {}

  @Post()
  create(@Body() createProductRatingPhotoDto: CreateProductRatingPhotoDto) {
    return this.productRatingPhotosService.create(createProductRatingPhotoDto);
  }

  @Get()
  findAll() {
    return this.productRatingPhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productRatingPhotosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductRatingPhotoDto: UpdateProductRatingPhotoDto) {
    return this.productRatingPhotosService.update(+id, updateProductRatingPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productRatingPhotosService.remove(+id);
  }
}
