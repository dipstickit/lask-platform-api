import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsPhotoService } from './products-photo.service';
import { CreateProductsPhotoDto } from './dto/create-products-photo.dto';
import { UpdateProductsPhotoDto } from './dto/update-products-photo.dto';

@Controller('products-photo')
export class ProductsPhotoController {
  constructor(private readonly productsPhotoService: ProductsPhotoService) {}

  @Post()
  create(@Body() createProductsPhotoDto: CreateProductsPhotoDto) {
    return this.productsPhotoService.create(createProductsPhotoDto);
  }

  @Get()
  findAll() {
    return this.productsPhotoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsPhotoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsPhotoDto: UpdateProductsPhotoDto) {
    return this.productsPhotoService.update(+id, updateProductsPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsPhotoService.remove(+id);
  }
}
