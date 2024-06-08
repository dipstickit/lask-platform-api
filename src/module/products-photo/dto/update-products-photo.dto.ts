import { PartialType } from '@nestjs/mapped-types';
import { CreateProductsPhotoDto } from './create-products-photo.dto';

export class UpdateProductsPhotoDto extends PartialType(CreateProductsPhotoDto) {}
