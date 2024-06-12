import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductRatingsService } from './product-ratings.service';
import { CreateProductRatingDto } from './dto/create-product-rating.dto';
import { UpdateProductRatingDto } from './dto/update-product-rating.dto';

@Controller('product-ratings')
export class ProductRatingsController {
  constructor(private readonly productRatingsService: ProductRatingsService) {}

  @Post()
  create(@Body() createProductRatingDto: CreateProductRatingDto) {
    return this.productRatingsService.create(createProductRatingDto);
  }

  @Get()
  findAll() {
    return this.productRatingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productRatingsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductRatingDto: UpdateProductRatingDto) {
    return this.productRatingsService.update(+id, updateProductRatingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productRatingsService.remove(+id);
  }
}
